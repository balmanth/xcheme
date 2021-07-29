import type Fragment from './fragment';
/**
 * An error product to compose the error list generated in the analysis process.
 */
export default class Error {
    #private;
    /**
     * Default constructor.
     * @param fragment Error fragment.
     * @param value Error value.
     */
    constructor(fragment: Fragment, value: string | number);
    /**
     * Get the error fragment.
     */
    get fragment(): Fragment;
    /**
     * Get the error value.
     */
    get value(): string | number;
}