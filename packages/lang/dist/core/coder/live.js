"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Live = void 0;
const Core = require("@xcheme/core");
const base_1 = require("./base");
/**
 * Generate a project output for running in memory.
 */
class Live extends base_1.Base {
    /**
     * Get a new entry pattern.
     * @param name Entry name.
     * @param references Entry references.
     * @param patterns Entry patterns.
     * @returns Returns the pattern.
     */
    getEntry(name, references, patterns) {
        return new Core.ExpectFlowPattern(new Core.OptFlowPattern(new Core.RepeatFlowPattern(new Core.ChooseFlowPattern(...patterns))), new Core.EndFlowPattern());
    }
    /**
     * Get a new route.
     * @param path Route path.
     * @param value Optional route value.
     * @param pattern Optional route pattern.
     * @returns Returns the route.
     */
    getRoute(path, value, pattern) {
        if (value !== void 0) {
            if (pattern !== void 0) {
                return new Core.SetValueRoute(value, pattern, ...path);
            }
            return new Core.SetValueRoute(value, path[0], ...path.slice(1));
        }
        if (pattern !== void 0) {
            return new Core.FlowRoute(pattern, path[0], ...path.slice(1));
        }
        return new Core.UnitRoute(path[0], ...path.slice(1));
    }
    /**
     * Get a new map pattern.
     * @param routes Map routes.
     * @returns Returns the pattern.
     */
    emitMapPattern(...routes) {
        return new Core.MapFlowPattern(...routes);
    }
    /**
     * Get a new token pattern.
     * @param identity Token identity.
     * @param patterns Expected patterns.
     * @returns Returns the pattern.
     */
    emitTokenPattern(identity, ...patterns) {
        return new Core.EmitTokenPattern(identity, ...patterns);
    }
    /**
     * Get a new node pattern.
     * @param identity Node identity.
     * @param output Output node direction.
     * @param patterns Expected patterns.
     * @returns Returns the pattern.
     */
    emitNodePattern(identity, output, ...patterns) {
        return new Core.EmitNodePattern(identity, output, ...patterns);
    }
    /**
     * Get a new identity pattern for dynamic directives.
     * @param identity New identity.
     * @param patterns Expected patterns.
     * @returns Returns the pattern.
     */
    emitIdentityPattern(identity, ...patterns) {
        return new Core.SetValuePattern(identity, ...patterns);
    }
    /**
     * Get a new condition pattern.
     * @param test Test pattern.
     * @param success Success pattern.
     * @param failure Failure pattern.
     * @returns Returns the pattern.
     */
    emitConditionPattern(test, success, failure) {
        return new Core.ConditionFlowPattern(test, success, failure);
    }
    /**
     * Get a new choose pattern.
     * @param patterns Possible patterns.
     * @returns Returns the pattern.
     */
    emitChoosePattern(...patterns) {
        return new Core.ChooseFlowPattern(...patterns);
    }
    /**
     * Get a new choose units pattern.
     * @param units Possible units.
     * @returns Returns the pattern.
     */
    emitChooseUnitsPattern(units) {
        return new Core.ChooseUnitPattern(...units);
    }
    /**
     * Get a new expect pattern.
     * @param patterns Expected patterns.
     * @returns Returns the pattern.
     */
    emitExpectPattern(...patterns) {
        return new Core.ExpectFlowPattern(...patterns);
    }
    /**
     * Get a new expect units pattern.
     * @param units Expected units.
     * @returns Returns the pattern.
     */
    emitExpectUnitsPattern(units) {
        return new Core.ExpectUnitPattern(...units);
    }
    /**
     * Get a new not pattern.
     * @param patterns Expected patterns.
     * @returns Returns the pattern.
     */
    emitNotPattern(...patterns) {
        return new Core.NotFlowPattern(...patterns);
    }
    /**
     * get a new opt pattern.
     * @param patterns Optional patterns.
     * @returns Returns the pattern.
     */
    emitOptPattern(...patterns) {
        return new Core.OptFlowPattern(...patterns);
    }
    /**
     * Get a new repeat pattern.
     * @param patterns Expected patterns.
     * @returns Returns the pattern.
     */
    emitRepeatPattern(...patterns) {
        return new Core.RepeatFlowPattern(...patterns);
    }
    /**
     * Get a new place node pattern.
     * @param current Current node destination.
     * @param patterns Expected patterns.
     * @returns Returns the pattern.
     */
    emitPlacePattern(current, ...patterns) {
        return new Core.PlaceNodePattern(current, ...patterns);
    }
    /**
     * Get a new append node pattern.
     * @param identity Node identity.
     * @param current Current node destination.
     * @param head Head pattern.
     * @param patterns Optional patterns.
     * @returns Returns the pattern.
     */
    emitAppendPattern(identity, current, head, ...patterns) {
        return new Core.AppendNodePattern(identity, 1 /* Right */, current, head, ...patterns);
    }
    /**
     * Get a new prepend node pattern.
     * @param identity Node identity.
     * @param current Current node destination.
     * @param head Head pattern.
     * @param patterns Optional patterns.
     * @returns Returns the pattern.
     */
    emitPrependPattern(identity, current, head, ...patterns) {
        return new Core.PrependNodePattern(identity, 1 /* Right */, current, head, ...patterns);
    }
    /**
     * Get a new pivot node pattern.
     * @param identity Node identity.
     * @param pivot Pivot pattern.
     * @param patterns Expected patterns.
     * @returns Returns the pattern.
     */
    emitPivotPattern(identity, pivot, ...patterns) {
        return new Core.PivotNodePattern(identity, 1 /* Right */, 0 /* Left */, pivot, ...patterns);
    }
    /**
     * Get a new symbol pattern.
     * @param identity Symbol identity.
     * @param symbol Symbol pattern.
     * @param patterns Expected patterns.
     * @returns Returns the pattern.
     */
    emitSymbolPattern(identity, symbol, ...patterns) {
        return new Core.EmitSymbolPattern(identity, symbol, ...patterns);
    }
    /**
     * Get a new symbol scope pattern.
     * @param patterns Expected patterns.
     * @returns Returns the pattern.
     */
    emitScopePattern(...patterns) {
        return new Core.ScopeSymbolPattern(...patterns);
    }
    /**
     * Get a new error pattern.
     * @param value Error value.
     * @param patterns Expected patterns.
     * @returns Returns the pattern.
     */
    emitErrorPattern(value, ...patterns) {
        return new Core.EmitErrorPattern(value, ...patterns);
    }
    /**
     * Get a new has pattern.
     * @param state Expected state value.
     * @param patterns Expected patterns.
     * @returns Returns the pattern.
     */
    emiHasPattern(state, ...patterns) {
        return new Core.HasStatePattern(state, ...patterns);
    }
    /**
     * Get a new set pattern.
     * @param state New state value.
     * @param patterns Expected patterns.
     * @returns Returns the pattern.
     */
    emitSetPattern(state, ...patterns) {
        return new Core.SetStatePattern(state, ...patterns);
    }
    /**
     * Get a new reference pattern.
     * @param entries Pointer entries.
     * @param identifier Reference identifier.
     * @returns Returns the pattern.
     */
    emitReferencePattern(entries, identifier) {
        const entry = entries.get(identifier);
        if (!entry.pattern) {
            return new Core.RunFlowPattern(() => entries.get(identifier).pattern);
        }
        return entry.pattern;
    }
    /**
     * Get a new any pattern.
     * @returns Returns the pattern.
     */
    emitAnyPattern() {
        return new Core.AnyUnitPattern();
    }
    /**
     * Get a new range pattern.
     * @param from From unit value.
     * @param to To unit value.
     * @returns Returns the pattern.
     */
    emitRangePattern(from, to) {
        return new Core.RangeUnitPattern(from, to);
    }
}
exports.Live = Live;
//# sourceMappingURL=live.js.map