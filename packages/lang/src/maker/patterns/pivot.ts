import * as Core from '@xcheme/core';

import * as Coder from '../../core/coder/base';
import * as Project from '../../core/project';
import * as Nodes from '../resolvers/nodes';
import * as Context from '../context';

/**
 * Consume the given node resolving the 'PIVOT' pattern.
 * @param project Project context.
 * @param node Input node.
 * @param state Consumption state.
 * @returns Returns the pattern or undefined when the node is invalid.
 */
export const consume = (project: Project.Context, node: Core.Node, state: Context.State): Coder.Pattern | undefined => {
  const patterns = Nodes.resolve(project, node.right!, state);
  if (patterns !== void 0) {
    const [test, ...remaining] = patterns;
    const { directive } = state;
    const identity = directive.dynamic ? Core.BaseSource.Output : directive.identity;
    return project.coder.emitPivotPattern(identity, test, ...remaining);
  }
  return void 0;
};
