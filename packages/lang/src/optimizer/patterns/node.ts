import * as Core from '@xcheme/core';

import * as Directive from '../nodes/directive';
import * as Reference from '../reference';
import * as Context from '../context';

import * as Expression from './expression';

import { Project } from '../../core/project';

/**
 * Consume the specified input node resolving its 'NODE' pattern.
 * @param project Input project.
 * @param direction Child node direction.
 * @param parent Parent node.
 * @param state Consumption state.
 */
export const consume = (project: Project, direction: Core.Nodes, parent: Core.Node, state: Context.State): void => {
  const node = parent.getChild(direction)!;
  const entry = state.entry;
  const type = state.type;
  state.type = Context.Types.Node;
  entry.type = Reference.Types.User;
  entry.identifier = node.fragment.data;
  Expression.consume(project, Core.Nodes.Right, node, state);
  parent.setChild(direction, new Directive.Node(node, entry.identity, entry.dynamic, state.alias));
  state.references[entry.identifier] = state.entry;
  state.type = type;
};
