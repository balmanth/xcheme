"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fragment_1 = require("./fragment");
/**
 * A symbol table for storing symbol records generated during the analysis process.
 */
class Table {
    /**
     * Table of records.
     */
    #records = {};
    /**
     * Table length.
     */
    #length = 0;
    /**
     * Parent table.
     */
    #parent;
    /**
     * Default constructor.
     * @param parent Parent table.
     */
    constructor(parent) {
        this.#parent = parent;
    }
    /**
     * Get the parent table.
     */
    get parent() {
        return this.#parent;
    }
    /**
     * Get all the record names in the table.
     */
    get names() {
        return Object.keys(this.#records);
    }
    /**
     * Get the number of entries in the table.
     */
    get length() {
        return this.#length;
    }
    /**
     * Check whether or not there's a symbol record for the given name.
     * @param name Symbol record name.
     * @returns Returns true when the symbol record already exists, false otherwise.
     */
    has(name) {
        return this.get(name) !== void 0;
    }
    /**
     * Get the symbol record that corresponds to the specified name.
     * @param name Symbol record name.
     * @returns Returns the corresponding record or undefined when the record wasn't found.
     */
    get(name) {
        return this.#records[name instanceof fragment_1.default ? name.data : name];
    }
    /**
     * Add a new symbol record into the symbol table.
     * @param record Symbol record.
     * @throw Throws an error when a symbol record with the same fragment data already exists.
     */
    add(record) {
        const name = record.fragment.data;
        if (this.#records[name]) {
            throw 'Unable to add records with duplicate fragment data.';
        }
        this.#records[name] = record;
        this.#length++;
    }
    /**
     * Find in all tables the symbol record that corresponds to the specified name.
     * @param name Symbol record name.
     * @returns Returns the corresponding record or undefined when the record wasn't found.
     */
    find(name) {
        const record = this.get(name);
        if (record === void 0 && this.#parent !== void 0) {
            return this.#parent.find(name);
        }
        return record;
    }
}
exports.default = Table;
//# sourceMappingURL=table.js.map