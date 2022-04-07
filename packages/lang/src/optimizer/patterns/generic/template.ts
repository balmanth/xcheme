import * as Core from '@xcheme/core';

import * as Project from '../../../core/project';
import * as Types from '../../../core/types';
import * as Parser from '../../../parser';
import * as Context from '../../context';
import * as Tree from '../../tree';

import { Errors } from '../../../core/errors';
import { Exception } from '../../../core/exception';

import * as Token from '../token';
import * as Node from '../node';

/**
 * Map of template arguments.
 */
export type Arguments = {
  [name: string]: Types.Node;
};

/**
 * Get a list of parameters from the given symbol table.
 * @param table Symbol table.
 * @returns Returns the parameters list.
 */
const getParameters = (table: Types.Table): string[] => {
  const list = [];
  for (const record of table) {
    if (record.value === Parser.Symbols.AliasParameter) {
      list.push(record.fragment.data);
    }
  }
  return list;
};

/**
 * Get the argument map from the specified node and parameters list.
 * @param project Project context.
 * @param node Arguments node.
 * @param parameters Parameters list.
 * @returns Returns the argument map.
 */
const getArguments = (project: Project.Context, node: Types.Node, parameters: string[]): Arguments | undefined => {
  if (node.right) {
    const args: Arguments = {};
    let current = node.right.left!;
    let index = 0;
    while (current) {
      const parameter = parameters[index++];
      const next = current.next;
      if (!parameter) {
        project.addError(current.fragment, Errors.UNEXPECTED_EXTRA_ARGUMENT);
      } else {
        switch (node.value) {
          case Parser.Nodes.Reference:
          case Parser.Nodes.Identity:
            args[parameter] = current;
            break;
          default:
            throw new Exception(`Unsupported argument node: ${current.value}`);
        }
      }
      current.set(Core.Nodes.Next, void 0);
      current = next!;
    }
    if (!parameters[index]) {
      return args;
    }
  }
  return void 0;
};

/**
 * Get an identifier from the given nodes.
 * @param nodes Node list.
 * @returns Returns the identifier.
 */
const getIdentifier = (...nodes: Types.Node[]): string => {
  const name = [];
  for (const node of nodes) {
    name.push(node.fragment.data);
  }
  return `@${name.join(':')}`;
};

/**
 * Clone the given node replacing any reference that exists in the specified arguments.
 * @param project Project context.
 * @param node Input node.
 * @param args Arguments list.
 * @param state Consumption state.
 * @returns Return the generated node tree.
 */
const clone = (
  project: Project.Context,
  node: Types.Node,
  args: Arguments,
  state: { table: Types.Table; link?: Types.Table }
): Types.Node => {
  const table = state.table;
  if (node.value === Parser.Nodes.Map) {
    state.table = new Core.Table<Types.Metadata>(node.table.parent);
  } else if (node.value === Parser.Nodes.Reference) {
    node = args[node.fragment.data] ?? node;
  }
  const result = new Core.Node<Types.Metadata>(node.fragment, node.value, table ?? state.table);
  for (const direction of [Core.Nodes.Left, Core.Nodes.Right, Core.Nodes.Next]) {
    const child = node.get(direction);
    if (child) {
      result.set(direction, clone(project, child, args, state));
    }
  }
  if (result.value === Parser.Nodes.MapMember) {
    const identifier = result.right!;
    if (identifier.value === Parser.Nodes.Identifier) {
      const record = new Core.Record(identifier.fragment, Parser.Symbols.MapMember, identifier, state.link);
      state.table.add(record);
      state.link = void 0;
    }
  }
  if (state.table !== table) {
    state.link = state.table;
  }
  state.table = table;
  return result;
};

/**
 * Resolve the corresponding template for the given node.
 * @param project Project context.
 * @param name Template name.
 * @param record Reference record.
 * @param args Template arguments.
 * @param state Consumption state.
 */
const resolve = (
  project: Project.Context,
  name: string,
  record: Types.Record,
  args: Arguments,
  state: Context.State
): void => {
  const template = record.node!;
  const location = template.fragment.location;
  const expression = clone(project, template.right!, args, { table: template.right!.table });
  const identity = template.left ? clone(project, template.left, args, { table: template.left.table }) : void 0;
  const type = record.data.type === Types.Directives.Token ? Parser.Nodes.AliasToken : Parser.Nodes.AliasNode;
  const identifier = Tree.getIdentifier(type, name, identity?.left?.fragment.data, template.table, location);
  const directive = Tree.getDirective(type, template.table, identifier, expression);
  const temp = Context.getNewState(state.anchor);
  if (record.data.type === Types.Directives.Token) {
    Token.consume(project, Core.Nodes.Right, directive, temp);
  } else {
    Node.consume(project, Core.Nodes.Right, directive, temp);
  }
  if (record.data.order > state.record!.data.order) {
    directive.set(Core.Nodes.Next, state.anchor.next!.next);
    state.anchor.next!.set(Core.Nodes.Next, directive);
  } else {
    template.table.get(name)!.data.order = record.data.order;
    directive.set(Core.Nodes.Next, state.anchor.next);
    state.anchor.set(Core.Nodes.Next, directive);
    state.anchor = directive;
  }
};

/**
 * Consume a child node from the AST in the given parent for generating the corresponding directive
 * based on the respective template and optimizing the generated directive reference.
 * @param project Project context.
 * @param direction Child node direction.
 * @param parent Parent node.
 * @param record Reference record.
 * @param state Consumption state.
 */
export const consume = (
  project: Project.Context,
  direction: Core.Nodes,
  parent: Types.Node,
  record: Types.Record,
  state: Context.State
): void => {
  const node = parent.get(direction)!;
  const args = getArguments(project, node, getParameters(record.link!));
  if (!args) {
    project.addError(node.fragment, Errors.ARGUMENTS_MISSING);
  } else {
    const identifier = getIdentifier(node, ...Object.values(args));
    if (!project.symbols.has(identifier)) {
      resolve(project, identifier, record, args, state);
    }
    const reference = Tree.getReference(identifier, node.table, node.fragment.location);
    node.swap(reference);
  }
};
