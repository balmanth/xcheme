import Base from '../../source/base';
import Token from '../../core/token';
import Expect from '../flow/expect';
import Pattern from '../pattern';

/**
 * Consume all the given patterns and, in case of success, it will emit a new token into the current token list.
 */
export default class Emit extends Pattern {
  /**
   * Target pattern.
   */
  #target: Pattern;

  /**
   * Token value.
   */
  #value: string | number;

  /**
   * Default constructor.
   * @param value Token value.
   * @param patterns Sequence of patterns.
   */
  constructor(value: string | number, ...patterns: Pattern[]) {
    super();
    this.#target = new Expect(...patterns);
    this.#value = value;
  }

  /**
   * Consume the given source.
   * @param source Data source.
   * @returns Returns true when the source was consumed, otherwise returns false.
   */
  consume(source: Base): boolean {
    source.saveState();
    const status = this.#target.consume(source);
    if (status) {
      const { value } = source.output;
      const result = this.#value === Base.Output ? value ?? -1 : this.#value;
      const token = new Token(source.fragment, result);
      source.emit(token);
    }
    source.discardState();
    return status;
  }
}
