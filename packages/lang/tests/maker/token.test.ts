import * as Helper from './helper';
import * as Lang from '../../src/index';

test('Token referring an undefined identifier', () => {
  Helper.makeError(new Lang.LiveCoder(), 'token TOKEN as ALIAS;', [Lang.Errors.UNDEFINED_IDENTIFIER]);
});

test('Token referring a node (reference error)', () => {
  Helper.makeError(new Lang.LiveCoder(), "node NODE as '@'; token TOKEN as NODE;", [Lang.Errors.INVALID_NODE_REFERENCE]);
});

test('Token referring an alias node (reference error)', () => {
  Helper.makeError(new Lang.LiveCoder(), "alias node NODE as '@'; token TOKEN as NODE;", [Lang.Errors.INVALID_ALIAS_NODE_REFERENCE]);
});

test('Token referring a token map entry (reference error)', () => {
  Helper.makeError(new Lang.LiveCoder(), "token TOKEN1 as map { <100> A as 'a' }; token TOKEN2 as TOKEN1.A;", [
    Lang.Errors.INVALID_MAP_ENTRY_REFERENCE
  ]);
});

test('Token referring an alias token map entry (reference error)', () => {
  Helper.makeError(new Lang.LiveCoder(), "alias token TOKEN1 as map { <100> A as 'a' }; token TOKEN2 as TOKEN1.A;", [
    Lang.Errors.INVALID_MAP_ENTRY_REFERENCE
  ]);
});

test('Token referring a node map entry (reference error)', () => {
  Helper.makeError(new Lang.LiveCoder(), "node NODE as map { <100> A as 'a' }; token TOKEN as NODE.A;", [
    Lang.Errors.INVALID_MAP_ENTRY_REFERENCE
  ]);
});

test('Token referring an alias node map entry (reference error)', () => {
  Helper.makeError(new Lang.LiveCoder(), "alias node NODE as map { <100> A as 'a' }; token TOKEN as NODE.A;", [
    Lang.Errors.INVALID_MAP_ENTRY_REFERENCE
  ]);
});

test('Loose token already defined (token collision)', () => {
  Helper.makeError(new Lang.LiveCoder(), "node NODE as '@'; token TOKEN as '@';", [Lang.Errors.TOKEN_COLLISION]);
});

test('Loose token range already defined (token collision)', () => {
  Helper.makeError(new Lang.LiveCoder(), "node NODE as from '0' to '9'; token TOKEN as from '0' to '9';", [
    Lang.Errors.TOKEN_COLLISION
  ]);
});

test('Loose token map entry already defined (token collision)', () => {
  Helper.makeError(new Lang.LiveCoder(), "node NODE as map { '@' }; token TOKEN as '@';", [Lang.Errors.TOKEN_COLLISION]);
});

test('Token already defined (token collision)', () => {
  Helper.makeError(new Lang.LiveCoder(), "token TOKEN1 as '@'; token TOKEN2 as '@';", [Lang.Errors.TOKEN_COLLISION]);
});

test('Token range already defined (token collision)', () => {
  Helper.makeError(new Lang.LiveCoder(), "token TOKEN1 as from '0' to '9'; token TOKEN2 as from '0' to '9';", [
    Lang.Errors.TOKEN_COLLISION
  ]);
});

test('Token map entry already defined (token collision)', () => {
  Helper.makeError(new Lang.LiveCoder(), "token TOKEN1 as '@'; token TOKEN2 as map { '@' };", [Lang.Errors.TOKEN_COLLISION]);
});

test('Token with an identity', () => {
  const project = Helper.makeParser(new Lang.TextCoder(), "token<1010> TOKEN as '@';");

  // Check the resulting token.
  const token = project.local.get('TOKEN')!;
  expect(token).toBeDefined();
  expect(token.identity).toBe(1010);
});

test('Token with an exported pattern', () => {
  const project = Helper.makeParser(new Lang.TextCoder(), "export alias token TOKEN as '@';");

  // Check the resulting token.
  const token = project.local.get('TOKEN')!;
  expect(token).toBeDefined();
  expect(token.exported).toBeTruthy();
});

test('Token with an imported pattern', () => {
  const project = Helper.makeParser(new Lang.TextCoder(), "import './module1'; token <3030> TOKEN as EXTERNAL_TOKEN1;");

  // Check the resulting token.
  const token = project.local.get('TOKEN')!;
  expect(token).toBeDefined();
  expect(token.identity).toBe(3030);
});
