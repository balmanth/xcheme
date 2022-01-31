import * as Core from '@xcheme/core';
import * as Helper from '../helper';
import * as Lang from '../../../src/index';

test("Output an 'ACCESS' rule with a token map", () => {
  const project = Helper.makeParser(new Lang.TextCoder(), "token <auto> TOKEN as map { <100> A as 'a' }; node NODE as TOKEN.A;");

  // Check the output code.
  const route = project.local.get('TOKEN@A')!;
  expect(route).toBeDefined();
  expect(route.identity).toBe(100);

  const token = project.local.get('TOKEN')!;
  expect(token).toBeDefined();
  expect(token.identity).toBe(Core.BaseSource.Output);
  expect(token.pattern).toBe(
    `new Core.EmitTokenPattern(${Core.BaseSource.Output}, ` +
      /**/ `new Core.MapFlowPattern(` +
      /******/ `new Core.SetValueRoute(${route.identity}, 'a')` +
      /**/ `)` +
      `)`
  );

  const node = project.local.get('NODE')!;
  expect(node).toBeDefined();
  expect(node.identity).toBe(0);
  expect(node.pattern).toBe(`new Core.EmitNodePattern(${node.identity}, 1, new Core.ExpectUnitPattern(${route.identity}))`);
});

test("Output an 'ACCESS' rule with a nested token map", () => {
  const project = Helper.makeParser(
    new Lang.TextCoder(),
    "token <auto> TOKEN as map { <100> A as 'a' & map { <200> B as 'b', C as 'c' } }; node NODE as TOKEN.A.B;"
  );

  // Check the output code.
  const routeA = project.local.get('TOKEN@A')!;
  expect(routeA).toBeDefined();
  expect(routeA.identity).toBe(100);

  const routeAB = project.local.get('TOKEN@A@B')!;
  expect(routeAB).toBeDefined();
  expect(routeAB.identity).toBe(200);

  const routeAC = project.local.get('TOKEN@A@C')!;
  expect(routeAC).toBeDefined();
  expect(routeAC.identity).toBe(100);

  const token = project.local.get('TOKEN')!;
  expect(token).toBeDefined();
  expect(token.identity).toBe(Core.BaseSource.Output);
  expect(token.pattern).toBe(
    `new Core.EmitTokenPattern(${Core.BaseSource.Output}, ` +
      /**/ `new Core.MapFlowPattern(` +
      /******/ `new Core.FlowRoute(` +
      /********/ `new Core.MapFlowPattern(` +
      /**********/ `new Core.SetValueRoute(${routeAB.identity}, 'b'), ` +
      /**********/ `new Core.SetValueRoute(${routeAC.identity}, 'c')` +
      /********/ `), ` +
      /******/ `'a')` +
      /**/ `)` +
      `)`
  );

  const node = project.local.get('NODE')!;
  expect(node).toBeDefined();
  expect(node.identity).toBe(0);
  expect(node.pattern).toBe(`new Core.EmitNodePattern(${node.identity}, 1, new Core.ExpectUnitPattern(${routeAB.identity}))`);
});
