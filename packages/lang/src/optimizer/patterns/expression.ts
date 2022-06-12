import * as Project from '../../core/project';
import * as Types from '../../core/types';
import * as Parser from '../../parser';
import * as Context from '../context';

import { Errors } from '../../core/errors';

import * as Range from './range';
import * as Reference from './reference';
import * as String from './string';
import * as Map from './map';
import * as Access from './access';
import * as Generic from './generic';

/**
 * Consume the given node and optimize the EXPRESSION patterns.
 * @param project Project context.
 * @param node Expression node.
 * @param state Context state.
 */
export const consume = (project: Project.Context, node: Types.Node, state: Context.State): void => {
  switch (node.value) {
    case Parser.Nodes.Reference:
      Reference.consume(project, node, state);
      break;
    case Parser.Nodes.Identity:
      project.addError(node.fragment, Errors.UNSUPPORTED_ARGUMENT);
      break;
    case Parser.Nodes.String:
      String.consume(project, node, state);
      break;
    case Parser.Nodes.Range:
      Range.consume(project, node, state);
      break;
    case Parser.Nodes.Map:
      Map.consume(project, node, state);
      break;
    case Parser.Nodes.Or:
      Generic.Sequence.consume(project, node, Parser.Nodes.Or, state);
      break;
    case Parser.Nodes.And:
      Generic.Sequence.consume(project, node, Parser.Nodes.And, state);
      break;
    case Parser.Nodes.AppendRTL:
    case Parser.Nodes.AppendRTR:
    case Parser.Nodes.AppendRTN:
    case Parser.Nodes.AppendLTL:
    case Parser.Nodes.AppendLTR:
    case Parser.Nodes.AppendLTN:
    case Parser.Nodes.AppendNTL:
    case Parser.Nodes.AppendNTR:
    case Parser.Nodes.AppendNTN:
    case Parser.Nodes.PrependRTL:
    case Parser.Nodes.PrependRTR:
    case Parser.Nodes.PrependRTN:
    case Parser.Nodes.PrependLTL:
    case Parser.Nodes.PrependLTR:
    case Parser.Nodes.PrependLTN:
    case Parser.Nodes.PrependNTL:
    case Parser.Nodes.PrependNTR:
    case Parser.Nodes.PrependNTN:
    case Parser.Nodes.Pivot:
    case Parser.Nodes.Symbol:
      Generic.Identity.consume(project, node, state);
      break;
    case Parser.Nodes.Error:
    case Parser.Nodes.Has:
    case Parser.Nodes.Set:
      Generic.State.consume(project, node, state);
      break;
    case Parser.Nodes.Access:
      Access.consume(project, node, state);
      break;
    default:
      if (node.right) {
        consume(project, node.right, state);
      }
  }
};
