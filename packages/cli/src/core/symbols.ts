import * as Lang from '@xcheme/lang';

import * as Console from './console';
import * as Fragment from './fragment';

/**
 * Get the depth indentation string.
 * @param depth Depth states.
 * @returns Return the depth indentation string.
 */
const getPadding = (depth: boolean[]): string => {
  const padding = [];
  for (let index = 1; index < depth.length; ++index) {
    padding.push(depth[index] ? '│  ' : '   ');
  }
  return padding.join('');
};

/**
 * Print all the symbols in the given table.
 * @param table Symbol table.
 * @param depth Depth states.
 */
const printTable = (table: Lang.Types.Table, ...depth: boolean[]): void => {
  const padding = getPadding(depth);
  let index = 1;
  for (const record of table) {
    const ending = index === table.length;
    const location = Fragment.getLocation(record.fragment);
    const fragment = Fragment.getMessage(record.fragment);
    const connector = depth.length > 0 ? (ending ? '└─ ' : '├─ ') : '';
    const value = record.value.toString().padStart(4, '0');
    Console.printLine(`${location} ${value} ${padding}${connector}${fragment}`);
    if (record.link) {
      printTable(record.link, ...depth, !ending);
    }
    index++;
  }
};

/**
 * Print all the symbol for the given symbol table.
 * @param table Symbol table.
 */
export const print = (table: Lang.Types.Table): void => {
  Console.printLine('Symbols:\n');
  Console.printLine('          Code Identifier');
  printTable(table);
  Console.printLine('');
};
