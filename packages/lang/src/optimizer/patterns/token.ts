import * as Core from '@xcheme/core';

import * as Nodes from '../../core/nodes';
import * as Project from '../../core/project';
import * as Symbols from '../../core/symbols';
import * as Parser from '../../parser';
import * as Context from '../context';
import * as Loose from '../loose';

import { Errors } from '../../core/errors';

import * as Expression from './expression';
import * as Range from './range';
import * as String from './string';

/**
 * Emit a new project symbol and replace the current TOKEN node by an optimized one.
 * @param project Project context.
 * @param direction Child node direction.
 * @param parent Parent node.
 * @param state Consumption state.
 */
const emit = (project: Project.Context, direction: Core.Nodes, parent: Core.Node, state: Context.State): void => {
  const node = parent.get(direction)!;
  const replacement = new Nodes.Directive(node, state.record!);
  parent.set(direction, replacement);
  project.symbols.add(state.record!);
};

/**
 * Consume a child node from the AST on the given parent and optimize the TOKEN directive.
 * @param project Project context.
 * @param direction Child node direction.
 * @param parent Parent node.
 * @param state Consumption state.
 */
export const consume = (
  project: Project.Context,
  direction: Core.Nodes,
  parent: Core.Node,
  state: Context.State
): void => {
  const node = parent.get(direction)!;
  const identifier = node.fragment.data;
  if (project.symbols.has(identifier)) {
    project.addError(node.fragment, Errors.DUPLICATE_IDENTIFIER);
  } else {
    const expression = node.right!;
    const record = node.table.get(identifier)!;
    state.record = record;
    state.type = Symbols.Types.Token;
    Context.setMetadata(project, identifier, record, state);
    if (!Symbols.isAlias(record) && Symbols.isEmpty(record)) {
      project.addError(node.fragment, Errors.UNDEFINED_IDENTITY);
    } else if (expression.value === Parser.Nodes.String) {
      String.consume(project, Core.Nodes.Right, node, state);
      const word = expression.fragment.data;
      if (!Loose.collision(project, word, expression)) {
        emit(project, direction, parent, state);
        project.symbols.link(word, identifier);
      }
    } else if (expression.value === Parser.Nodes.Range) {
      Range.consume(project, Core.Nodes.Right, node, state);
      const range = `${expression.left!.fragment.data}-${expression.right!.fragment.data}`;
      if (!Loose.collision(project, range, expression)) {
        emit(project, direction, parent, state);
        project.symbols.link(range, identifier);
      }
    } else {
      Expression.consume(project, Core.Nodes.Right, node, state);
      emit(project, direction, parent, state);
    }
  }
};
