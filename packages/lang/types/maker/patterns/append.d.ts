import * as Core from '@xcheme/core';
import { Project } from '../common/project';
import { State } from '../common/context';
import type { PatternEntry } from '../coder/base';
/**
 * Consume the specified input node resolving its 'APPEND' pattern.
 * It can also update the given project and context state during the consumption.
 * @param project Input project.
 * @param node Input node.
 * @param state Context state.
 * @param direction Append direction.
 * @returns Returns the consumption result or undefined when the pattern is invalid.
 */
export declare const consume: (project: Project, node: Core.Node, state: State, direction: Core.Nodes) => PatternEntry | undefined;
