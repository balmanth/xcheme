import * as Core from '@xcheme/core';

import * as Project from '../core/project';
import * as Counter from '../core/counter';
import * as Types from '../core/types';

/**
 * Global order counter.
 */
const orderCounter = new Counter.Context();

/**
 * Context node.
 */
export type Node = {
  /**
   * Node direction.
   */
  direction: Core.Nodes;
  /**
   * Node parent.
   */
  parent: Types.Node;
};

/**
 * Context consumption state.
 */
export type State = {
  /**
   * State type.
   */
  type: Types.Directives;
  /**
   * State origin.
   */
  origin: Types.Origins;
  /**
   * State identity.
   */
  identity: number;
  /**
   * Determines whether or not the consumption is for a template.
   */
  template: boolean;
  /**
   * Anchor node.
   */
  anchor: Types.Node;
  /**
   * State record.
   */
  record?: Types.Record;
};

/**
 * Get a new state based on the given parameters.
 * @param anchor Anchor node.
 * @param identity Initial identity.
 * @returns Returns the new state.
 */
export const getNewState = (anchor: Types.Node, identity?: number): State => {
  return {
    type: Types.Directives.Unknown,
    origin: Types.Origins.User,
    identity: identity ?? NaN,
    template: false,
    anchor
  };
};

/**
 * Set the record's metadata based on the given identifier and consumption state.
 * @param project Project context.
 * @param identifier Record identifier.
 * @param record Target record.
 * @param state Consumption state.
 * @returns Returns the given symbol record.
 */
export const setMetadata = (
  project: Project.Context,
  identifier: string,
  record: Types.Record,
  state: State
): Types.Record => {
  record.assign({
    type: state.type,
    origin: state.origin,
    order: orderCounter.increment(project.coder),
    name: `L${project.id}:${identifier}`,
    template: state.template,
    identifier: identifier,
    identity: state.identity,
    location: project.name,
    imported: false,
    exported: false,
    dependencies: [],
    dependents: [],
    pattern: void 0
  });
  return record;
};
