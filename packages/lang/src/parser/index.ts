import * as Core from '@xcheme/core';

import * as Types from '../core/types';

import { Errors } from '../core/errors';
import { Program } from './program';

export { Symbols } from './symbols';
export { Nodes } from './nodes';

/**
 * Consume the given source.
 * @param source Data source.
 * @returns Returns true when the source was consumed, otherwise returns false.
 */
export const consume = (source: Types.Source): boolean => {
  return Program.consume(source);
};

/**
 * Consume the specified tokens and produce an AST for the given context.
 * @param tokens Input tokens.
 * @param context Output context.
 * @returns Returns true when the consumption was successful, false otherwise.
 */
export const consumeTokens = (tokens: Types.Token[], context: Types.Context): boolean => {
  const source = new Core.TokenSource<Types.Metadata>(tokens, context);
  if (!Program.consume(source)) {
    const fragment = tokens[source.longestState.offset]?.fragment ?? source.fragment;
    context.addError(fragment, Errors.UNEXPECTED_SYNTAX);
    return false;
  }
  return true;
};
