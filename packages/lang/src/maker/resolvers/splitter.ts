import * as Core from '@xcheme/core';

import * as Mergeable from '../../core/nodes/mergeable';
import * as Identity from '../../core/nodes/identity';
import * as Coder from '../../core/coder/base';
import * as String from '../../core/string';
import * as Project from '../../core/project';
import * as Parser from '../../parser';
import * as Context from '../context';

import * as And from '../patterns/and';

/**
 * Split the first part of the specified mergeable node and resolve all the patterns.
 * @param project Project context.
 * @param node Mergeable node.
 * @param state Consumption state.
 * @returns Returns an array containing all patterns or undefined when the node is invalid.
 */
const split = (project: Project.Context, node: Mergeable.Node, state: Context.State): Coder.Pattern[] | undefined => {
  const record = node.sequence.shift()!;
  const patterns = And.resolve(project, node, state);
  if (patterns) {
    let units;
    if (node.type === Parser.Nodes.String) {
      units = String.extract(record.fragment.data).split('');
    } else {
      units = [(record as Identity.Node).identity];
    }
    return [project.coder.emitExpectUnitsPattern(units), ...patterns];
  }
  return void 0;
};

/**
 * Traverse the specified node trying to split the first part of the mergeable node and resolve all the patterns.
 * @param project Project context.
 * @param node Mergeable node.
 * @param state Consumption state.
 * @returns Returns an array containing all patterns or undefined when the node is invalid.
 */
const traverse = (project: Project.Context, node: Core.Node, state: Context.State): Coder.Pattern[] | undefined => {
  const left = resolve(project, node.left!, state);
  if (left) {
    const right = resolve(project, node.right!, state);
    if (right) {
      return [...left, ...right];
    }
  }
  return void 0;
};

/**
 * Resolve the given node splitting the first part from the mergeable node in an 'AND' pattern.
 * @param project Project context.
 * @param node Input node.
 * @param state Consumption state.
 * @returns Returns an array containing all patterns or undefined when the node is invalid.
 */
export const resolve = (project: Project.Context, node: Core.Node, state: Context.State): Coder.Pattern[] | undefined => {
  if (node.value === Parser.Nodes.And) {
    if (node instanceof Mergeable.Node) {
      if (node.sequence.length > 1) {
        return split(project, node, state);
      }
    } else {
      return traverse(project, node, state);
    }
  }
  return And.resolve(project, node, state);
};
