import * as Parser from '../../src/index';
import * as Assert from '../utils/assert';

/**
 * Expected expression tree.
 */
const expression = {
  type: Parser.Nodes.AppendNTL,
  right: {
    type: Parser.Nodes.Reference,
    value: 'REF'
  }
};

// NEXT APPEND LEFT

test('Consume the NEXT APPEND LEFT expression in a SKIP pattern', () => {
  Assert.skip(`skip next append left REF;`, expression);
});

test('Consume the NEXT APPEND LEFT expression in a TOKEN pattern', () => {
  Assert.token(`token <100> TOKEN as next append left REF;`, 'TOKEN', '100', expression);
});

test('Consume the NEXT APPEND LEFT expression in a NODE pattern', () => {
  Assert.node(`node <200> NODE as next append left REF;`, 'NODE', '200', expression);
});
