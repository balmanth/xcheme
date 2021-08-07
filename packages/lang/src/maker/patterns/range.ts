import * as Core from '@xcheme/core';

import * as String from '../common/string';
import * as Entries from '../common/entries';

import { Project } from '../common/project';
import { State, Types } from '../common/context';

import type { PatternEntry } from '../coder/base';

/**
 * Consume the specified input node resolving its alphabet range pattern.
 * It can also update the given project and context state when new tokens are created.
 * @param project Input project.
 * @param node Input node.
 * @param state Context state.
 * @returns Returns the consumption result or undefined when the pattern is invalid.
 */
export const consume = (project: Project, node: Core.Node, state: State): PatternEntry | undefined => {
  const from = node.left!.fragment.data;
  const to = node.right!.fragment.data;
  const pattern = project.coder.getRange(String.extract(from), String.extract(to));
  if (state.type === Types.Node) {
    const id = state.counters.token++;
    const result = project.coder.getToken(id, pattern);
    project.tokenEntries.add(id, `${from}-${to}`, result, Entries.Types.Normal);
    return project.coder.getAlphabet([id]);
  }
  return pattern;
};
