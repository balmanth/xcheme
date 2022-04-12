import * as Core from '@xcheme/core';

import * as Nodes from '../../core/nodes';
import * as Project from '../../core/project';
import * as Symbols from '../../core/symbols';
import * as Context from '../context';

import * as Expression from './expression';

/**
 * Consume the specified state making the NODE directive.
 * @param project Project context.
 * @param state Consumption state.
 */
export const consume = (project: Project.Context, state: Context.State): void => {
  const directive = state.directive;
  const record = Nodes.getRecord(directive);
  if (!record.data.template) {
    let expression = Expression.consume(project, directive.right!, state);
    if (expression) {
      if (!Symbols.isAlias(record)) {
        expression = project.coder.emitNodePattern(record.data.identity, Core.Nodes.Right, expression);
      }
      record.data.pattern = expression;
    }
  }
};
