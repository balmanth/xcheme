import * as Core from '@xcheme/core';
import * as Helper from '../helper';
import * as Lang from '../../../src/index';

test('Parse a group rule', () => {
  const project = Helper.makeParser(new Lang.LiveCoder(), "skip ('1' | '2') & 'x';");
  const context = new Core.Context('test');

  Helper.testLexer(project, context, '1x2x');
});