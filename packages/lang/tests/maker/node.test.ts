import * as Helper from './helper';
import * as Lang from '../../src/index';

test('Node referring an undefined identifier', () => {
  Helper.makeError(new Lang.LiveCoder(), 'node NODE as TOKEN;', [Lang.Errors.UNDEFINED_IDENTIFIER]);
});

test('Node referring an alias token (reference error)', () => {
  Helper.makeError(new Lang.LiveCoder(), "alias token TOKEN as '@'; node NODE as TOKEN;", [Lang.Errors.INVALID_ALIAS_TOKEN_REFERENCE]);
});

test('Node referring an unresolved token (reference error)', () => {
  Helper.makeError(new Lang.LiveCoder(), "node NODE as TOKEN; token TOKEN as '@';", [Lang.Errors.UNRESOLVED_TOKEN_REFERENCE]);
});

test('Node referring an undefined token map entry (reference error)', () => {
  Helper.makeError(new Lang.LiveCoder(), "token TOKEN as map { 'a' }; node NODE as TOKEN.A;", [Lang.Errors.UNDEFINED_IDENTIFIER]);
});

test('Node referring a node map entry (reference error)', () => {
  Helper.makeError(new Lang.LiveCoder(), "node NODE1 as map { A as 'a' }; node NODE2 as NODE1.A;", [
    Lang.Errors.INVALID_MAP_ENTRY_REFERENCE
  ]);
});

test('Node referring an alias node map entry (reference error)', () => {
  Helper.makeError(new Lang.LiveCoder(), "alias node NODE1 as map { A as 'a' }; node NODE2 as NODE1.A;", [
    Lang.Errors.INVALID_MAP_ENTRY_REFERENCE
  ]);
});

test('Node referring a whole token map (reference error)', () => {
  Helper.makeError(new Lang.LiveCoder(), "token TOKEN as map { A as 'a' }; node NODE as TOKEN;", [Lang.Errors.INVALID_MAP_REFERENCE]);
});

test('Node referring a whole nested token map (reference error)', () => {
  Helper.makeError(new Lang.LiveCoder(), "token TOKEN as map { A as 'a' & map { B as 'b' } }; node NODE as TOKEN.A;", [
    Lang.Errors.INVALID_MAP_REFERENCE
  ]);
});

test('Node referring a loose token already defined (token collision)', () => {
  Helper.makeError(new Lang.LiveCoder(), "token TOKEN as '@'; node NODE as TOKEN & '@';", [Lang.Errors.TOKEN_COLLISION]);
});

test('Node referring a loose token range already defined (token collision)', () => {
  Helper.makeError(new Lang.LiveCoder(), "token TOKEN as from 'a' to 'z'; node NODE as from 'a' to 'z';", [
    Lang.Errors.TOKEN_COLLISION
  ]);
});

test('Node referring a loose token map already defined (token collision)', () => {
  Helper.makeError(new Lang.LiveCoder(), "token TOKEN as 'a'; node NODE as map { 'a' };", [Lang.Errors.TOKEN_COLLISION]);
});

test('Node with an identity', () => {
  const project = Helper.makeParser(new Lang.TextCoder(), "node <2020> NODE as '@';");

  // Check the resulting node.
  const node = project.nodeEntries.get('NODE')!;
  expect(node).toBeDefined();
  expect(node.identity).toBe(2020);
});
