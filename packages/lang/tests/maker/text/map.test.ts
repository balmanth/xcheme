import * as Core from '@xcheme/core';

import * as Assert from './utils/assert';

test("Output a 'MAP' pattern", () => {
  Assert.output(
    `
    skip map {
      'a',
      'b',
      'c'
    };`,
    {
      '@SKIP0':
        `new Core.MapFlowPattern(` +
        /**/ `new Core.UnitRoute('a'), ` +
        /**/ `new Core.UnitRoute('b'), ` +
        /**/ `new Core.UnitRoute('c')` +
        `)`
    }
  );
});

test("Output a 'MAP' pattern with compound patterns", () => {
  Assert.output(
    `
    skip map {
      'a' & opt 'b' & repeat 'c'
    };`,
    {
      '@SKIP0':
        `new Core.MapFlowPattern(` +
        /**/ `new Core.FlowRoute(` +
        /******/ `new Core.ExpectFlowPattern(` +
        /********/ `new Core.OptFlowPattern(new Core.ExpectUnitPattern('b')), ` +
        /********/ `new Core.RepeatFlowPattern(new Core.ExpectUnitPattern('c'))` +
        /******/ `), ` +
        /**/ `'a')` +
        `)`
    }
  );
});

test("Output a 'MAP' pattern with a nested map pattern", () => {
  Assert.output(
    `
    skip map {
      'a' & map {
        '1',
        '2'
      },
      'b',
      'c'
    };`,
    {
      '@SKIP0':
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
    }
  );
});

test("Output a 'MAP' pattern in a token directive", () => {
  Assert.output(
    `
    token <auto> TOKEN as map {
      <100> A as 'a',
                 'b',
                 'c'
    };`,
    {
      TOKEN:
        `new Core.EmitTokenPattern(${Core.BaseSource.Output}, ` +
        /**/ `new Core.MapFlowPattern(` +
        /******/ `new Core.SetValueRoute(100, 'a'), ` +
        /******/ `new Core.SetValueRoute(0, 'b'), ` +
        /******/ `new Core.SetValueRoute(1, 'c')` +
        /**/ `)` +
        `)`
    }
  );
});

test("Output a 'MAP' pattern in an alias token directive", () => {
  Assert.output(
    `
    alias token ALIAS as map {
      <100> A as 'a',
                 'b',
                 'c'
    };`,
    {
      ALIAS:
        `new Core.MapFlowPattern(` +
        /**/ `new Core.SetValueRoute(100, 'a'), ` +
        /**/ `new Core.UnitRoute('b'), ` +
        /**/ `new Core.UnitRoute('c')` +
        `)`
    }
  );
});

test("Output a 'MAP' pattern in a node directive", () => {
  Assert.output(
    `
    node <auto> NODE as map {
      <100> A as 'a',
                 'b',
                 'c'
    };`,
    {
      NODE:
        `new Core.EmitNodePattern(${Core.BaseSource.Output}, 1, ` +
        /**/ `new Core.MapFlowPattern(` +
        /******/ `new Core.SetValueRoute(100, 0), ` +
        /******/ `new Core.SetValueRoute(2, 1), ` +
        /******/ `new Core.SetValueRoute(4, 3)` +
        /**/ `)` +
        `)`
    }
  );
});

test("Output a 'MAP' pattern in an alias node directive", () => {
  Assert.output(
    `
    alias node ALIAS as map {
      <100> A as 'a',
                 'b',
                 'c'
    };`,
    {
      ALIAS:
        `new Core.MapFlowPattern(` +
        /**/ `new Core.SetValueRoute(100, 1), ` +
        /**/ `new Core.UnitRoute(2), ` +
        /**/ `new Core.UnitRoute(3)` +
        `)`
    }
  );
});

test("Output a 'MAP' pattern in a node directive using map expressions", () => {
  Assert.output(
    `
    token <auto> TOKEN as map {
      <100> A as 'a',
      <101> B as 'b',
      <102> C as 'c'
    };
    node <auto> NODE as map {
      <200> A as TOKEN.A & TOKEN.C,
      TOKEN.B & TOKEN.C
    };`,
    {
      TOKEN:
        `new Core.EmitTokenPattern(${Core.BaseSource.Output}, ` +
        /**/ `new Core.MapFlowPattern(` +
        /******/ `new Core.SetValueRoute(100, 'a'), ` +
        /******/ `new Core.SetValueRoute(101, 'b'), ` +
        /******/ `new Core.SetValueRoute(102, 'c')` +
        /**/ `)` +
        `)`,
      NODE:
        `new Core.EmitNodePattern(${Core.BaseSource.Output}, 1, ` +
        /**/ `new Core.MapFlowPattern(` +
        /******/ `new Core.SetValueRoute(200, 100, 102), ` +
        /******/ `new Core.SetValueRoute(0, 101, 102)` +
        /**/ `)` +
        `)`
    }
  );
});
