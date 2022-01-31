"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consume = void 0;
const Expression = require("./expression");
/**
 * Consume the specified state resolving the 'TOKEN' directive.
 * @param project Project context.
 * @param state Consumption state.
 */
const consume = (project, state) => {
    const directive = state.directive;
    const expression = Expression.consume(project, directive.right, state);
    if (expression) {
        const entry = project.local.get(directive.identifier);
        if (directive.alias) {
            entry.pattern = expression;
        }
        else {
            const identity = directive.identity;
            entry.pattern = project.coder.emitTokenPattern(identity, expression);
            if (entry.references > 0) {
                entry.references++;
                const identifier = `@${entry.identifier}`;
                const link = project.local.create(entry.type, entry.origin, identifier, entry.identity);
                link.pattern = project.coder.emitReferencePattern(entry);
                link.dependencies.push(entry);
                entry.dependents.push(link);
            }
        }
    }
};
exports.consume = consume;
//# sourceMappingURL=token.js.map