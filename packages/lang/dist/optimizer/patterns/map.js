"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consume = void 0;
const Core = require("@xcheme/core");
const Member = require("../../core/nodes/member");
const Mergeable = require("../../core/nodes/mergeable");
const Identity = require("../../core/nodes/identity");
const Parser = require("../../parser");
const Loose = require("../loose");
const Expression = require("./expression");
/**
 * Get the candidate node based on the given input node.
 * @param node Input node.
 * @param parent Node parent.
 * @returns Returns the candidate node or undefined when there's no candidates.
 */
const getCandidate = (node, parent) => {
    if (node.value !== 209 /* Then */ && node.value !== 211 /* Or */) {
        if (node.value === 204 /* String */ || node instanceof Identity.Node || node instanceof Mergeable.Node) {
            if (parent) {
                const right = parent.right;
                parent.setChild(0 /* Left */, void 0);
                parent.setChild(1 /* Right */, void 0);
                parent.swap(right);
            }
            return node;
        }
        if (node.left) {
            return getCandidate(node.left, node);
        }
    }
    return void 0;
};
/**
 * Consume a child node from the AST on the given parent and optimize the map pattern.
 * @param project Project context.
 * @param direction Child node direction.
 * @param parent Parent node.
 * @param state Context state.
 */
const consume = (project, direction, parent, state) => {
    let member = parent.getChild(direction).right;
    state.entry.dynamic = true;
    while (member) {
        const expression = member.right;
        if (expression.value === 200 /* Identifier */) {
            if (state.entry.type === 1 /* Skip */) {
                project.addError(expression, 4101 /* UNSUPPORTED_IDENTITY */);
                break;
            }
            const entry = state.entry;
            state.entry = {
                type: entry.type,
                origin: 0 /* User */,
                identity: expression.left ? parseInt(expression.left.fragment.data) : NaN || state.entry.identity,
                identifier: `${state.entry.identifier}@${expression.fragment.data}`,
                alias: false,
                dynamic: false,
                exported: false,
                dependencies: []
            };
            Expression.consume(project, 1 /* Right */, expression, state);
            const candidate = getCandidate(expression.right);
            if (!candidate) {
                project.addError(member, 4114 /* INVALID_MAP_ENTRY */);
            }
            else {
                if (candidate.value === 204 /* String */) {
                    Loose.collision(project, candidate, candidate.fragment.data);
                }
                const { type, origin, identifier, identity } = state.entry;
                const replacement = new Member.Node(expression.right, state.entry, candidate);
                project.local.create(type, origin, identifier, identity, state.entry);
                member.setChild(1 /* Right */, replacement);
            }
            state.entry = entry;
        }
        else {
            Expression.consume(project, 1 /* Right */, member, state);
            const candidate = getCandidate(member.right);
            if (!candidate) {
                project.addError(member, 4114 /* INVALID_MAP_ENTRY */);
            }
            else {
                if (candidate.value === 204 /* String */) {
                    Loose.collision(project, candidate, candidate.fragment.data);
                }
                const replacement = new Member.Node(member.right, state.entry, candidate);
                member.setChild(1 /* Right */, replacement);
            }
        }
        member = member.next;
    }
};
exports.consume = consume;
//# sourceMappingURL=map.js.map