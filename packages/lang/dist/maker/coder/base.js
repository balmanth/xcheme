"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
/**
 * Common interface for any kind of coder.
 */
class Base {
    /**
     * Should be implemented to return an entry pattern.
     * @param name Entry name.
     * @param pointers Entry pointers.
     * @param patterns Entry patterns.
     * @returns Should return the pattern.
     */
    getEntry(name, pointers, ...patterns) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return a route.
     * @param value Route value.
     * @param path Route path.
     * @returns Should return the route.
     */
    getRoute(value, path) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return a skip pattern.
     * @param patterns Skip patterns.
     * @returns Should return the pattern.
     */
    getSkip(...patterns) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return a token pattern.
     * @param value Token value.
     * @param patterns Expected patterns.
     * @returns Should return the pattern.
     */
    getToken(value, ...patterns) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return a node pattern.
     * @param value Node value.
     * @param output Output node direction.
     * @param patterns Expected patterns.
     * @returns Should return the pattern.
     */
    getNode(value, output, ...patterns) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return a condition pattern.
     * @param test Test pattern.
     * @param success Success pattern.
     * @param failure Failure pattern.
     * @returns Should return the pattern.
     */
    getCondition(test, success, failure) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return a choose pattern.
     * @param patterns Possible patterns.
     * @returns Should return the pattern.
     */
    getChoose(...patterns) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return a choose alphabet pattern.
     * @param alphabet Possible alphabet.
     * @returns Should return the pattern.
     */
    getChooseAlphabet(alphabet) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return an expect pattern.
     * @param patterns Expected patterns.
     * @returns Should return the pattern.
     */
    getExpect(...patterns) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return an expect unit pattern.
     * @param alphabet Expected alphabet.
     * @returns Should return the pattern.
     */
    getExpectAlphabet(alphabet) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return a negate pattern.
     * @param patterns Expected patterns.
     * @returns Should return the pattern.
     */
    getNegate(...patterns) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return an option pattern.
     * @param patterns Optional patterns.
     * @returns Should return the pattern.
     */
    getOption(...patterns) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return a repeat pattern.
     * @param patterns Expected patterns.
     * @returns Should return the pattern.
     */
    getRepeat(...patterns) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return a scope node pattern.
     * @param current Current node destination.
     * @param patterns Expected patterns.
     * @returns Should return the pattern.
     */
    getScopeNode(current, ...patterns) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return a pivot node pattern.
     * @param value Node value.
     * @param pivot Pivot pattern.
     * @param patterns Expected patterns.
     * @returns Should return the pattern.
     */
    getPivotNode(value, pivot, ...patterns) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return an append node pattern.
     * @param value Node value.
     * @param current Current node destination.
     * @param patterns Expected patterns.
     * @returns Should return the pattern.
     */
    getAppendNode(value, current, ...patterns) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return a prepend node pattern.
     * @param value Node value.
     * @param current Current node destination.
     * @param patterns Expected patterns.
     * @returns Should return the pattern.
     */
    getPrependNode(value, current, ...patterns) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return a symbol pattern.
     * @param value Symbol value.
     * @param patterns Expected patterns.
     * @returns Should return the pattern.
     */
    getSymbol(value, symbol, ...patterns) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return a scope symbol pattern.
     * @param patterns Expected patterns.
     * @returns Should return the pattern.
     */
    getScopeSymbol(...patterns) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return a reference pattern.
     * @param entries Pointer entries.
     * @param name Reference name.
     * @returns Should return the pattern.
     */
    getReference(entries, name) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return an any pattern.
     * @returns Should return the pattern.
     */
    getAny() {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return a range pattern.
     * @param from From the alphabet value.
     * @param to To alphabet value.
     * @returns Should return the pattern.
     */
    getRange(from, to) {
        throw "Method doesn't implemented.";
    }
    /**
     * Should be implemented to return an alphabet pattern.
     * @param alphabet Input alphabet.
     * @returns Should return the pattern.
     */
    getAlphabet(alphabet) {
        throw "Method doesn't implemented.";
    }
}
exports.Base = Base;
//# sourceMappingURL=base.js.map