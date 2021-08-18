import * as Core from '@xcheme/core';
import * as Lexer from '../lexer';

import BinaryExpression from './patterns/binary';
import UnaryExpression from './patterns/unary';

import { Symbols } from './symbols';
import { Nodes } from './nodes';

const identity = new Core.ExpectFlowPattern(
  new Core.ExpectUnitPattern(Lexer.Tokens.OpenChevron),
  new Core.AppendNodePattern(
    Nodes.Identity,
    Core.Nodes.Left,
    Core.Nodes.Right,
    new Core.ExpectUnitPattern(Lexer.Tokens.Number),
    new Core.ExpectUnitPattern(Lexer.Tokens.CloseChevron)
  )
);

const expression: Core.Pattern = new Core.ExpectFlowPattern(
  // Or expressions
  new BinaryExpression(
    new Core.MapFlowPattern(new Core.SetValueRoute(Nodes.Or, Lexer.Tokens.Or)),
    // And expressions
    new BinaryExpression(
      new Core.MapFlowPattern(new Core.SetValueRoute(Nodes.And, Lexer.Tokens.And)),
      // Unary operations
      new UnaryExpression(
        new Core.MapFlowPattern(
          new Core.SetValueRoute(Nodes.Not, Lexer.Tokens.Not),
          new Core.SetValueRoute(Nodes.Opt, Lexer.Tokens.Opt),
          new Core.SetValueRoute(Nodes.Rep, Lexer.Tokens.Rep),
          new Core.SetValueRoute(Nodes.Place, Lexer.Tokens.Place),
          new Core.SetValueRoute(Nodes.Pivot, Lexer.Tokens.Pivot),
          new Core.SetValueRoute(Nodes.Append, Lexer.Tokens.Append),
          new Core.SetValueRoute(Nodes.Prepend, Lexer.Tokens.Prepend),
          new Core.SetValueRoute(Nodes.PlaceNext, Lexer.Tokens.Place, Lexer.Tokens.Next),
          new Core.SetValueRoute(Nodes.AppendNext, Lexer.Tokens.Append, Lexer.Tokens.Next),
          new Core.SetValueRoute(Nodes.PrependNext, Lexer.Tokens.Prepend, Lexer.Tokens.Next),
          new Core.SetValueRoute(Nodes.PlaceLeft, Lexer.Tokens.Place, Lexer.Tokens.Left),
          new Core.SetValueRoute(Nodes.AppendLeft, Lexer.Tokens.Append, Lexer.Tokens.Left),
          new Core.SetValueRoute(Nodes.PrependLeft, Lexer.Tokens.Prepend, Lexer.Tokens.Left),
          new Core.SetValueRoute(Nodes.PlaceRight, Lexer.Tokens.Place, Lexer.Tokens.Right),
          new Core.SetValueRoute(Nodes.AppendRight, Lexer.Tokens.Append, Lexer.Tokens.Right),
          new Core.SetValueRoute(Nodes.PrependRight, Lexer.Tokens.Prepend, Lexer.Tokens.Right),
          new Core.SetValueRoute(Nodes.Symbol, Lexer.Tokens.Symbol),
          new Core.SetValueRoute(Nodes.Scope, Lexer.Tokens.Scope),
          new Core.SetValueRoute(Nodes.Error, identity, Lexer.Tokens.Error),
          new Core.SetValueRoute(Nodes.Has, identity, Lexer.Tokens.Has),
          new Core.SetValueRoute(Nodes.Set, identity, Lexer.Tokens.Set)
        ),
        new Core.ChooseFlowPattern(
          // Range
          new Core.PlaceNodePattern(
            Core.Nodes.Right,
            new Core.ExpectUnitPattern(Lexer.Tokens.From),
            new Core.AppendNodePattern(
              Nodes.Alphabet,
              Core.Nodes.Right,
              Core.Nodes.Right,
              new Core.ExpectUnitPattern(Lexer.Tokens.Alphabet)
            ),
            new Core.PivotNodePattern(
              Nodes.Range,
              Core.Nodes.Right,
              Core.Nodes.Left,
              new Core.ExpectUnitPattern(Lexer.Tokens.To),
              new Core.AppendNodePattern(
                Nodes.Alphabet,
                Core.Nodes.Right,
                Core.Nodes.Right,
                new Core.ExpectUnitPattern(Lexer.Tokens.Alphabet)
              )
            )
          ),
          // Any, Alphabet & Reference
          new Core.AppendNodePattern(
            Core.BaseSource.Output,
            Core.Nodes.Right,
            Core.Nodes.Right,
            new Core.MapFlowPattern(
              new Core.SetValueRoute(Nodes.Any, Lexer.Tokens.Any),
              new Core.SetValueRoute(Nodes.Alphabet, Lexer.Tokens.Alphabet),
              new Core.SetValueRoute(Nodes.Reference, Lexer.Tokens.Identifier)
            )
          ),
          // Group
          new Core.PlaceNodePattern(
            Core.Nodes.Right,
            new Core.ExpectFlowPattern(
              new Core.ExpectUnitPattern(Lexer.Tokens.OpenParentheses),
              new Core.RunFlowPattern(() => expression),
              new Core.ExpectUnitPattern(Lexer.Tokens.CloseParentheses)
            )
          )
        )
      )
    )
  ),
  // Condition
  new Core.OptFlowPattern(
    new Core.PivotNodePattern(
      Nodes.Then,
      Core.Nodes.Right,
      Core.Nodes.Left,
      new Core.ExpectUnitPattern(Lexer.Tokens.Then),
      new Core.RunFlowPattern(() => expression),
      new Core.OptFlowPattern(
        new Core.PivotNodePattern(
          Nodes.Else,
          Core.Nodes.Right,
          Core.Nodes.Left,
          new Core.ExpectUnitPattern(Lexer.Tokens.Else),
          new Core.RunFlowPattern(() => expression)
        )
      )
    )
  )
);

const token = new Core.ExpectFlowPattern(
  new Core.OptFlowPattern(identity),
  new Core.EmitSymbolPattern(
    Symbols.Token,
    new Core.PivotNodePattern(
      Nodes.Identifier,
      Core.Nodes.Right,
      Core.Nodes.Left,
      new Core.ExpectUnitPattern(Lexer.Tokens.Identifier)
    ),
    new Core.ExpectUnitPattern(Lexer.Tokens.As),
    new Core.PlaceNodePattern(Core.Nodes.Right, expression)
  )
);

const node = new Core.ExpectFlowPattern(
  new Core.OptFlowPattern(identity),
  new Core.EmitSymbolPattern(
    Symbols.Node,
    new Core.PivotNodePattern(
      Nodes.Identifier,
      Core.Nodes.Right,
      Core.Nodes.Left,
      new Core.ExpectUnitPattern(Lexer.Tokens.Identifier)
    ),
    new Core.ExpectUnitPattern(Lexer.Tokens.As),
    new Core.PlaceNodePattern(Core.Nodes.Right, expression)
  )
);

/**
 * Main parser program.
 */
export const Program = new Core.ExpectFlowPattern(
  new Core.OptFlowPattern(
    new Core.RepeatFlowPattern(
      new Core.ChooseFlowPattern(
        new Core.EmitNodePattern(
          Core.BaseSource.Output,
          Core.Nodes.Right,
          new Core.MapFlowPattern(
            new Core.SetValueRoute(Nodes.Skip, expression, Lexer.Tokens.Skip),
            new Core.SetValueRoute(Nodes.Token, token, Lexer.Tokens.Token),
            new Core.SetValueRoute(Nodes.Node, node, Lexer.Tokens.Node),
            new Core.SetValueRoute(Nodes.AliasToken, token, Lexer.Tokens.Alias, Lexer.Tokens.Token),
            new Core.SetValueRoute(Nodes.AliasNode, node, Lexer.Tokens.Alias, Lexer.Tokens.Node)
          ),
          new Core.ExpectUnitPattern(Lexer.Tokens.Semicolon)
        )
      )
    )
  ),
  new Core.EndFlowPattern()
);
