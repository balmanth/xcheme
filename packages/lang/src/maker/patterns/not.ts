import * as Coder from '../../core/coder/base';
import * as Project from '../../core/project';
import * as Types from '../../core/types';
import * as Context from '../context';

import * as And from './and';

/**
 * Consume the given node making the NOT pattern.
 * @param project Project context.
 * @param node NOT node.
 * @param state Consumption state.
 * @returns Returns the pattern or undefined when the node is invalid.
 */
export const consume = (
  project: Project.Context,
  node: Types.Node,
  state: Context.State
): Coder.Pattern | undefined => {
  const patterns = And.resolve(project, node.right!, state);
  if (patterns) {
    return project.coder.emitNotPattern(...patterns);
  }
  return void 0;
};
