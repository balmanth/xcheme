import Base from '../route';
import Pattern from '../pattern';
import Set from './set';

/**
 * Produce a route to consume units and, in case of success, it set a new state value.
 */
export default class Route<R extends object> extends Base<R> {
  /**
   * Default constructor.
   * @param value State value.
   * @param first Route pattern or first route unit.
   * @param units Route units.
   */
  constructor(value: number, first: Pattern<R> | string | number, ...units: (string | number)[]) {
    if (first instanceof Pattern) {
      super(new Set<R>(value, first), units[0], ...units.splice(1));
    } else {
      super(new Set<R>(value), first, ...units);
    }
  }
}
