import * as Lang from '../../../src/index';
import * as Assert from './utils/assert';

test("Append without an identity in a 'SKIP' directive", () => {
  Assert.error(
    `
    skip append 'a';`,
    [
      {
        code: Lang.Errors.UNDEFINED_IDENTITY,
        column: [9, 15],
        line: [1, 1]
      }
    ]
  );
});

test("Append without an identity in an 'ALIAS TOKEN' directive", () => {
  Assert.error(
    `
    alias token ALIAS as append 'a';`,
    [
      {
        code: Lang.Errors.UNDEFINED_IDENTITY,
        column: [25, 31],
        line: [1, 1]
      },
      {
        code: Lang.Errors.UNDEFINED_IDENTITY,
        column: [16, 21],
        line: [1, 1]
      }
    ]
  );
});

test("Append without an identity in a 'MAP' operand", () => {
  Assert.error(
    `
    alias token ALIAS as map {
      ENTRY as 'a' & append 'b'
    };`,
    [
      {
        code: Lang.Errors.UNDEFINED_IDENTITY,
        column: [21, 27],
        line: [2, 2]
      },
      {
        code: Lang.Errors.UNDEFINED_IDENTITY,
        column: [6, 11],
        line: [2, 2]
      }
    ]
  );
});

test('Append with an unexpected argument', () => {
  Assert.error(
    `
    skip append <X> 'a';`,
    [
      {
        code: Lang.Errors.UNEXPECTED_ARGUMENT,
        column: [17, 18],
        line: [1, 1]
      },
      {
        code: Lang.Errors.UNDEFINED_IDENTITY,
        column: [9, 19],
        line: [1, 1]
      }
    ]
  );
});

test('Append with an unexpected extra argument', () => {
  Assert.error(
    `
    skip append <100, auto> 'a';`,
    [
      {
        code: Lang.Errors.UNEXPECTED_EXTRA_ARGUMENT,
        column: [22, 26],
        line: [1, 1]
      }
    ]
  );
});