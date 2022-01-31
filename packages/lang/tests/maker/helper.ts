import * as Path from 'path';
import * as FS from 'fs';

import * as Core from '@xcheme/core';

import { Lexer, Parser, Optimizer, Maker, Errors, Project, BaseCoder } from '../../src/index';

/**
 * Import hook for loading the imported file contents.
 * @param file File path.
 * @returns Returns the imported file contents or undefined when the file wasn't found.
 */
const loadFileHook = (file: string): string | undefined => {
  const path = Path.join(__dirname, file);
  if (FS.existsSync(path)) {
    return FS.readFileSync(path, { encoding: 'utf-8' });
  }
  return void 0;
};

/**
 * Print all errors in the given list.
 * @param errors Error list.
 */
const printErrors = (errors: Core.Error[]): void => {
  for (const error of errors) {
    const fragment = error.fragment;
    const location = fragment.location;
    console.log(`${location.name}: '${fragment.data}' (${error.value}) at line ${location.line + 1}, column ${location.column + 1}`);
  }
};

/**
 * Make a new parser using the given coder and input text.
 * @param coder Project coder.
 * @param text Input text.
 * @returns Returns the generated project.
 */
export const makeParser = (coder: BaseCoder, text: string): Project.Context => {
  const project = new Project.Context('make', coder, { loadFileHook });
  const context = new Core.Context('make');
  let status: boolean;

  // Consume input text.
  if (!(status = Lexer.consumeText(text, context))) {
    printErrors(context.errors);
  }
  expect(status).toBeTruthy();

  // Consume input tokens.
  if (!(status = Parser.consumeTokens(context.tokens, context))) {
    printErrors(context.errors);
  }
  expect(status).toBeTruthy();

  // Consume input nodes and optimize its tree.
  if (!(status = Optimizer.consumeNodes(context.node, project))) {
    printErrors(project.errors);
  }
  expect(status).toBeTruthy();

  // Consume input nodes and make the output.
  if (!(status = Maker.consumeNodes(context.node, project))) {
    printErrors(project.errors);
  }
  expect(status).toBeTruthy();

  return project;
};

/**
 * Make a new parser using the given coder and input text expecting errors.
 * @param coder Project coder.
 * @param text Input text.
 * @param errors Expected errors.
 * @returns Returns the generated project.
 */
export const makeError = (coder: BaseCoder, text: string, errors: Errors[]): Project.Context => {
  const project = new Project.Context('make', coder, { loadFileHook });
  const context = new Core.Context('make');
  let status: boolean;

  // Consume input text.
  if (!(status = Lexer.consumeText(text, context))) {
    printErrors(context.errors);
  }
  expect(status).toBeTruthy();

  // Consume input tokens.
  if (!(status = Parser.consumeTokens(context.tokens, context))) {
    printErrors(context.errors);
  }
  expect(status).toBeTruthy();

  // Consume input nodes and optimize its tree.
  if ((status = Optimizer.consumeNodes(context.node, project))) {
    status = Maker.consumeNodes(context.node, project);
  }

  expect(status).toBeFalsy();
  expect(project.errors).toHaveLength(errors.length);

  for (const error of project.errors) {
    expect(errors).toContain(error.value);
  }

  return project;
};

/**
 * Test the lexer from the given project using the input text and context.
 * @param project Lexer project.
 * @param context Lexer context.
 * @param text Input text.
 */
export const testLexer = (project: Project.Context, context: Core.Context, text: string): void => {
  const source = new Core.TextSource(text, context);
  const lexer = project.lexer as Core.Pattern;

  // Parse the given input text.
  const status = lexer.consume(source);
  if (!status) {
    printErrors(context.errors);
  }

  expect(status).toBeTruthy();
  expect(source.offset).toBe(text.length);
  expect(source.length).toBe(0);
};

/**
 * Test the parser from the given project using the input tokens and context.
 * @param project Parser project.
 * @param context Parser context.
 * @param tokens Input tokens.
 */
export const testParser = (project: Project.Context, context: Core.Context, tokens: Core.Token[]): void => {
  const source = new Core.TokenSource(tokens, context);
  const parser = project.parser as Core.Pattern;

  // Parse the given input tokens.
  const status = parser.consume(source);
  if (!status) {
    printErrors(context.errors);
  }

  expect(status).toBeTruthy();
  expect(source.offset).toBe(tokens.length);
  expect(source.length).toBe(0);
};
