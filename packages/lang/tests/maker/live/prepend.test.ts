import * as Core from '@xcheme/core';
import * as Helper from '../helper';
import * as Lang from '../../../src/index';

test("Parse a 'PREPEND NEXT' rule", () => {
  const project = Helper.makeParser(new Lang.LiveCoder(), "skip prepend next '@';");
  const context = new Core.Context('test');

  Helper.testLexer(project, context, '@@@');
});

test("Parse a 'PREPEND LEFT' rule", () => {
  const project = Helper.makeParser(new Lang.LiveCoder(), "skip prepend left '@';");
  const context = new Core.Context('test');

  Helper.testLexer(project, context, '@@@');
});

test("Parse a 'PREPEND RIGHT' rule", () => {
  const project = Helper.makeParser(new Lang.LiveCoder(), "skip prepend right '@';");
  const context = new Core.Context('test');

  Helper.testLexer(project, context, '@@@');
});

test("Parse a 'PREPEND' rule", () => {
  const project = Helper.makeParser(new Lang.LiveCoder(), "skip prepend '@';");
  const context = new Core.Context('test');

  Helper.testLexer(project, context, '@@@');
});

test("Parse a 'PREPEND' rule with a map", () => {
  const project = Helper.makeParser(new Lang.LiveCoder(), "skip prepend map { 'a', 'b', 'c' };");
  const context = new Core.Context('test');

  Helper.testLexer(project, context, 'abcaabbcc');
});
