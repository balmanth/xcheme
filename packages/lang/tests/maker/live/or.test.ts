import * as Core from '@xcheme/core';
import * as Helper from '../helper';
import * as Lang from '../../../src/index';

test("Parse subsequent 'OR' rules (simple)", () => {
  const project = Helper.makeParser(new Lang.LiveCoder(), "skip '-' | '+' | '@';");
  const context = new Core.Context('test');

  Helper.testLexer(project, context, '-+@-+@');
});

test("Parse subsequent 'OR' rules (complex)", () => {
  const project = Helper.makeParser(new Lang.LiveCoder(), "skip '-' | '+' | '123' | 'abc';");
  const context = new Core.Context('test');

  Helper.testLexer(project, context, '-123+abc');
});

test("Parse subsequent 'OR' rules (optimized)", () => {
  const project = Helper.makeParser(new Lang.LiveCoder(), "skip repeat '-' | '+' | '@' & ('1' | '2') | 'A' | 'B';");
  const context = new Core.Context('test');

  Helper.testLexer(project, context, '---+@1AB@2');
});