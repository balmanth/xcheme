"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consume = void 0;
const Loose = require("../loose");
const Nodes = require("../nodes");
const Expression = require("./expression");
/**
 * Consume a child node from the AST on the given parent and optimize the range pattern.
 * @param project Project context.
 * @param direction Child node direction.
 * @param parent Parent node.
 * @param state Context state.
 */
const consume = (project, direction, parent, state) => {
    if (state.entry.type === 3 /* Node */) {
        const node = parent.getChild(direction);
        const name = `${node.left.fragment.data}-${node.right.fragment.data}`;
        const entry = Loose.resolve(project, node, state, name);
        const reference = Nodes.getReference(entry.identifier, node.table, node.fragment.location);
        parent.setChild(direction, reference);
        Expression.consume(project, direction, parent, state);
    }
};
exports.consume = consume;
//# sourceMappingURL=range.js.map