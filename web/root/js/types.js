"use strict";

/**
 * A static class for checking data types
 */
class Type
{
    /**
     * Get the type of data.
     * @param {any} data
     * @returns string
     */
    static get(data)
    {
        return Object.prototype.toString.apply(data).replace(/\[object (.+)\]/i, '$1').toLowerCase();
    }

    /**
     * Get the type of data. If data is an instance of a certain class, it returns the class name.
     * @param {any} data
     * @returns string
     */
    static getEx(data)
    {
        let type = this.get(data);

        return (type === 'object' ? data.constructor.name : type);
    }

    /**
     * Checks if data is either null or undefined.
     * @param {any} data
     * @returns boolean
     */
    static isVoid(data)
    {
        return (data === null || data === undefined);
    }

    /**
     * Checks if data is a string.
     * @param {any} data
     * @returns boolean
     */
    static isString(data)
    {
        return this.get(data) === 'string';
    }

    /**
     * Checks if data is an empty (zero-length) string.
     * @param {any} data
     * @returns boolean
     */
    static isEmptyString(data)
    {
        return this.isString(data) && data.length === 0;
    }

    /**
     * Checks if data is a string of spaces.
     * @param {any} data
     * @returns boolean
     */
    static isSpaceString(data)
    {
        return this.isString(data) && data.length > 0 && data.trim() === '';
    }

    static isArray(data)
    {
        return this.get(data) === 'array';
    }

    /**
     * Checks if data is an actual number.
     * @param {any} data
     * @returns boolean
     */
    static isNumber(data)
    {
        return this.get(data) === 'number' && !isNaN(data);
    }

    /**
     * Checks if data is a numeric string.
     * @param {any} data
     * @returns boolean
     */
    static isNumericString(data)
    {
        return this.isString(data) && this.isNumber(parseFloat(data));
    }

    /**
     * Checks if data is either a number or a numeric string.
     * @param {any} data
     * @returns boolean
     */
    static isNumeric(data)
    {
        return this.isNumber(data) || this.isNumericString(data);
    }

    static isInteger(data)
    {
        return this.isNumeric(data) && parseInt(data) === parseFloat(data);
    }
}

/**
 * Checks type of variable
 * source: https://stackoverflow.com/a/55692897
 * @param {Any} data
 */
// export function type(data) {
function type(data)
{
    /*
    type("string") //string
    type(null) //null
    type(undefined) //undefined
    type([]) //array
    type({}) //object
    type(function() {}) //function
    type(123) //number
    type(new Number(123)) //number
    type(/some_regex/) //regexp
    type(Symbol("foo")) //symbol
    */
    return Object.prototype.toString.apply(data).replace(/\[object (.+)\]/i, '$1').toLowerCase();
};
