import * as Project from '../../core/project';
import * as Symbols from '../../core/symbols';
import * as Types from '../../core/types';
import * as Parser from '../../parser';
import * as Identity from '../identity';
import * as Context from '../context';
import * as Loose from '../loose';

import { Errors } from '../../core/errors';

import * as Expression from './expression';

/**
 * Consume the given node and optimize its TOKEN directive.
 * @param project Project context.
 * @param node Directive node.
 * @param state Consumption state.
 */
export const consume = (project: Project.Context, node: Types.Node, state: Context.State): void => {
  const identifier = node.fragment.data;
  if (project.symbols.has(identifier)) {
    project.addError(node.fragment, Errors.DUPLICATE_IDENTIFIER);
  } else {
    const record = node.table.get(identifier)!;
    state.record = record;
    state.type = Types.Directives.Token;
    state.template = Symbols.isTemplate(record);
    state.identity = Identity.consume(project, node.left, state);
    Context.setMetadata(project, identifier, record, state);
    Types.assignNode(node, {
      type: Types.Nodes.Directive,
      record
    });
    if (!Symbols.isAlias(record) && Symbols.isEmpty(record)) {
      project.addError(node.fragment, Errors.UNDEFINED_IDENTITY);
    } else {
      project.symbols.add(record);
      if (!state.template) {
        const expression = node.right!;
        Expression.consume(project, expression, state);
        if (expression.value === Parser.Nodes.String) {
          const word = expression.fragment.data;
          if (!Loose.collision(project, word, expression)) {
            project.symbols.link(word, identifier);
          }
        } else if (expression.value === Parser.Nodes.Range) {
          const range = `${expression.left!.fragment.data}-${expression.right!.fragment.data}`;
          if (!Loose.collision(project, range, expression)) {
            project.symbols.link(range, identifier);
          }
        }
      }
    }
  }
};
