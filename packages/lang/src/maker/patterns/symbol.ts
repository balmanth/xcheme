import * as Core from '@xcheme/core';

import * as Coder from '../../core/coder/base';
import * as Project from '../../core/project';
import * as Context from '../context';

import * as And from './and';

/**
 * Consume the given node resolving the 'SYMBOL' pattern.
 * @param project Project context.
 * @param node Input node.
 * @param state Consumption state.
 * @returns Returns the pattern or undefined when the node is invalid.
 */
export const consume = (project: Project.Context, node: Core.Node, state: Context.State): Coder.Pattern | undefined => {
  const patterns = And.resolve(project, node.right!, state);
  if (patterns !== void 0) {
    const directive = state.directive;
    return project.coder.emitSymbolPattern(directive.identity, patterns[0], ...patterns.slice(1));
  }
  return void 0;
};
