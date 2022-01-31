import * as Core from '@xcheme/core';
import * as Helper from '../helper';
import * as Lang from '../../../src/index';

test("Output a 'MAP' rule", () => {
  const project = Helper.makeParser(new Lang.TextCoder(), "skip map { 'a', 'b', 'c' };");

  // Check the output code.
  const rule = project.local.get('@SKIP0')!;
  expect(rule).toBeDefined();
  expect(rule.identity).toBe(0);
  expect(rule.pattern).toBe(
    `new Core.MapFlowPattern(` +
      /**/ `new Core.UnitRoute('a'), ` +
      /**/ `new Core.UnitRoute('b'), ` +
      /**/ `new Core.UnitRoute('c')` +
      `)`
  );
});

test("Output a 'MAP' rule with a nested map pattern", () => {
  const project = Helper.makeParser(new Lang.TextCoder(), "skip map { 'a' & map { '1', '2' }, 'b', 'c' };");

  // Check the output code.
  const rule = project.local.get('@SKIP0')!;
  expect(rule).toBeDefined();
  expect(rule.identity).toBe(0);
  expect(rule.pattern).toBe(
    `new Core.MapFlowPattern(` +
      /**/ `new Core.FlowRoute(` +
      /******/ `new Core.MapFlowPattern(` +
      /********/ `new Core.UnitRoute('1'), ` +
      /********/ `new Core.UnitRoute('2')` +
      /******/ `), ` +
      /**/ `'a'), ` +
      /**/ `new Core.UnitRoute('b'), ` +
      /**/ `new Core.UnitRoute('c')` +
      `)`
  );
});

test("Output a 'MAP' rule with compound patterns", () => {
  const project = Helper.makeParser(new Lang.TextCoder(), "skip map { 'a' & opt 'b' & repeat 'c' };");

  // Check the output code.
  const rule = project.local.get('@SKIP0')!;
  expect(rule).toBeDefined();
  expect(rule.identity).toBe(0);
  expect(rule.pattern).toBe(
    `new Core.MapFlowPattern(` +
      /**/ `new Core.FlowRoute(` +
      /******/ `new Core.ExpectFlowPattern(` +
      /********/ `new Core.OptFlowPattern(new Core.ExpectUnitPattern('b')), ` +
      /********/ `new Core.RepeatFlowPattern(new Core.ExpectUnitPattern('c'))` +
      /******/ `), ` +
      /**/ `'a')` +
      `)`
  );
});

test("Output a 'MAP' rule with a token pattern", () => {
  const project = Helper.makeParser(new Lang.TextCoder(), "token <auto> TOKEN as map { <100> A as 'a', 'b', 'c' };");

  // Check the output code.
  const routeA = project.local.get('TOKEN@A')!;
  expect(routeA).toBeDefined();
  expect(routeA.identity).toBe(100);

  const rule = project.local.get('TOKEN')!;
  expect(rule).toBeDefined();
  expect(rule.identity).toBe(Core.BaseSource.Output);
  expect(rule.pattern).toBe(
    `new Core.EmitTokenPattern(${Core.BaseSource.Output}, ` +
      /**/ `new Core.MapFlowPattern(` +
      /******/ `new Core.SetValueRoute(${routeA.identity}, 'a'), ` +
      /******/ `new Core.SetValueRoute(${rule.identity}, 'b'), ` +
      /******/ `new Core.SetValueRoute(${rule.identity}, 'c')` +
      /**/ `)` +
      `)`
  );
});

test("Output a 'MAP' rule with a node pattern", () => {
  const project = Helper.makeParser(new Lang.TextCoder(), "node <auto> NODE as map { <100> A as 'a', 'b', 'c' };");

  // Check the output code.
  const token1 = project.local.get('@REF0')!; // 'a'
  expect(token1.identity).toBe(0);
  expect(token1).toBeDefined();

  const token2 = project.local.get('@REF1')!; // 'b'
  expect(token2.identity).toBe(1);
  expect(token2).toBeDefined();

  const token3 = project.local.get('@REF2')!; // 'c'
  expect(token3.identity).toBe(2);
  expect(token3).toBeDefined();

  const routeA = project.local.get('NODE@A')!;
  expect(routeA).toBeDefined();
  expect(routeA.identity).toBe(100);

  const rule = project.local.get('NODE')!;
  expect(rule).toBeDefined();
  expect(rule.identity).toBe(Core.BaseSource.Output);
  expect(rule.pattern).toBe(
    `new Core.EmitNodePattern(${Core.BaseSource.Output}, 1, ` +
      /**/ `new Core.MapFlowPattern(` +
      /******/ `new Core.SetValueRoute(${routeA.identity}, ${token1.identity}), ` +
      /******/ `new Core.SetValueRoute(${rule.identity}, ${token2.identity}), ` +
      /******/ `new Core.SetValueRoute(${rule.identity}, ${token3.identity})` +
      /**/ `)` +
      `)`
  );
});
