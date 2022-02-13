import type Base from '../../source/base';

import Pattern from '../pattern';
import Try from './try';

/**
 * Consume all the given patterns in this pattern as an optional behavior.
 */
export default class Opt extends Pattern {
  /**
   * Target pattern.
   */
  #target: Pattern;

  /**
   * Default constructor.
   * @param patterns Sequence of patterns.
   */
  constructor(...patterns: Pattern[]) {
    super();
    this.#target = new Try(...patterns);
  }

  /**
   * Consume the given source.
   * @param source Data source.
   * @returns Returns true anyways.
   */
  consume(source: Base): boolean {
    this.#target.consume(source);
    return true;
  }
}
