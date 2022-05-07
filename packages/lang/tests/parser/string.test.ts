import * as Lang from '../../src';

import * as Assert from './utils/assert';

test('Consume an expected STRING pattern', () => {
  Assert.tree(
    `
    skip 'test';`,
    {
      type: Lang.Parser.Nodes.Skip,
      right: {
        type: Lang.Parser.Nodes.String,
        value: "'test'"
      }
    }
  );
});
