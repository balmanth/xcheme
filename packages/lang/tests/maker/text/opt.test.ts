import * as Helper from '../helper';
import * as Lang from '../../../src/index';

test("Output an 'OPT' rule", () => {
  const project = Helper.makeParser(new Lang.TextCoder(), "skip '.' & opt '@';");

  // Check the output code.
  const rule = project.local.get('@SKIP0')!;
  expect(rule).toBeDefined();
  expect(rule.identity).toBe(0);
  expect(rule.pattern).toBe(
    `new Core.ExpectFlowPattern(` +
      /**/ `new Core.ExpectUnitPattern('.'), ` +
      /**/ `new Core.OptFlowPattern(` +
      /******/ `new Core.ExpectUnitPattern('@')` +
      /**/ `)` +
      `)`
  );
});
