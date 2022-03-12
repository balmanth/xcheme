import * as Core from '@xcheme/core';

import * as Console from './console';
import * as Fragment from './fragment';

/**
 * Get the node direction name based on the given direction value.
 * @param direction Direction value.
 * @returns Returns the direction name.
 */
const getDirection = (direction: Core.Nodes): string => {
  switch (direction) {
    case Core.Nodes.Left:
      return 'L';
    case Core.Nodes.Right:
      return 'R';
    case Core.Nodes.Next:
      return 'N';
  }
};

/**
 * Get the depth indentation string.
 * @param depth Depth states.
 * @returns Return the depth indentation string.
 */
const getPadding = (depth: boolean[]): string => {
  const padding = [];
  const length = depth.length - 1;
  for (let index = 0; index < length; ++index) {
    padding.push(depth[index] ? '│  ' : '   ');
  }
  return padding.join('');
};

/**
 * Print recursively all the child nodes in the given parent node.
 * @param direction Child node direction.
 * @param parent Parent node.
 * @param depth Depth states.
 */
const printTree = (direction: Core.Nodes, parent: Core.Node, ...depth: boolean[]): void => {
  const node = parent.getChild(direction)!;
  const padding = getPadding(depth);
  const children = depth.length > 0;
  const connected = children && depth[depth.length - 1];
  for (const current of node) {
    const name = getDirection(direction);
    const location = Fragment.getLocation(current.fragment);
    const fragment = Fragment.getMessage(current.fragment);
    const connector = children ? (direction === Core.Nodes.Next ? '   ' : connected ? '├─ ' : '└─ ') : '';
    const value = current.value.toString();
    Console.printLine(` ${location} ${padding}${connector}${name} ${value} "${fragment}"`);
    if (current.left) {
      printTree(Core.Nodes.Left, current, ...depth, current.right !== void 0 || current.next !== void 0);
    }
    if (current.right) {
      printTree(Core.Nodes.Right, current, ...depth, current.next !== void 0);
    }
    direction = Core.Nodes.Next;
  }
};

/**
 * Print the corresponding tree for the given node.
 * @param node Input node.
 */
export const print = (node: Core.Node): void => {
  if (node.next) {
    Console.printLine('Nodes:\n');
    printTree(Core.Nodes.Next, node);
    Console.printLine('');
  }
};
