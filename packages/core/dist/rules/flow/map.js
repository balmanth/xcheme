"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pattern_1 = require("../pattern");
/**
 * Consume the first route that match in the list of routes given for this pattern.
 */
class Map extends pattern_1.default {
    /**
     * Root node.
     */
    #root;
    /**
     * Compare the given inputs and returns the difference between both of them.
     * @param a Input A.
     * @param b Input B.
     * @returns Returns less than zero when input A is less than input B.
     *          Returns greater than zero when input A is greater than input B.
     *          Returns zero when input A is equals to input B.
     */
    #compare(a, b) {
        const x = typeof a === 'string' ? a.charCodeAt(0) : a;
        const y = typeof b === 'string' ? b.charCodeAt(0) : b;
        return x - y;
    }
    /**
     * Get the node that correspond to the given input units.
     * @param units Input units.
     * @returns Returns the corresponding node or undefined when it wasn't found.
     */
    #getNode(units) {
        let current = this.#root;
        let previous = void 0;
        for (let index = 0; index < units.length;) {
            if (!current) {
                return void 0;
            }
            const diff = this.#compare(current.value, units[index]);
            if (diff < 0) {
                current = current.left;
            }
            else if (diff > 0) {
                current = current.right;
            }
            else {
                previous = current;
                current = current.next;
                index++;
            }
        }
        return previous;
    }
    /**
     * Set a new node based on the given input units.
     * @param units Input units.
     * @returns Returns the terminal node or undefined when the given units are empty.
     */
    #setNode(units) {
        let current = this.#root;
        let previous = current;
        let selected = current;
        let diff = 0;
        for (let index = 0; index < units.length;) {
            if (current) {
                diff = this.#compare(current.value, units[index]);
                if (diff < 0) {
                    previous = current;
                    current = current.left;
                    continue;
                }
                else if (diff > 0) {
                    previous = current;
                    current = current.right;
                    continue;
                }
            }
            else {
                const node = { value: units[index] };
                if (previous) {
                    if (diff < 0) {
                        previous.left = current = node;
                    }
                    else if (diff > 0) {
                        previous.right = current = node;
                    }
                    else {
                        previous.next = current = node;
                    }
                    diff = 0;
                }
                else {
                    this.#root = previous = current = node;
                }
            }
            selected = current;
            previous = current;
            current = current.next;
            index++;
        }
        return selected;
    }
    /**
     * Find a node with pattern in the given data source starting from the specified node.
     * @param source Data source.
     * @param current Current node.
     * @returns Returns the corresponding node or undefined when it wasn't found.
     */
    #findNode(source, current) {
        source.saveState();
        while (source.length > 0 && current !== void 0) {
            const diff = this.#compare(current.value, source.value);
            if (diff < 0) {
                current = current.left;
            }
            else if (diff > 0) {
                current = current.right;
            }
            else {
                if (current.pattern) {
                    source.discardState();
                    return current;
                }
                source.nextState();
                current = current.next;
            }
        }
        source.restoreState();
        source.discardState();
        return void 0;
    }
    /**
     * Default constructor.
     * @param routes List of routes.
     */
    constructor(...routes) {
        super();
        for (const route of routes) {
            const node = this.#getNode(route.units) ?? this.#setNode(route.units);
            if (node) {
                node.pattern = route.pattern;
            }
        }
    }
    /**
     * Consume the given source.
     * @param source Data source.
     * @returns Returns true when the source was consumed, otherwise returns false.
     */
    consume(source) {
        let current = this.#root;
        let longest;
        while ((current = this.#findNode(source, current)) !== void 0) {
            longest = current;
            current = current.next;
            source.nextState();
        }
        if (longest !== void 0) {
            return longest.pattern.consume(source);
        }
        return false;
    }
}
exports.default = Map;
//# sourceMappingURL=map.js.map