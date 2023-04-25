"use strict";
/**
 * Checks type of variable
 * source: https://stackoverflow.com/a/55692897
 * @param {Any} obj 
 */
// export function type(obj) {
function type(obj) {
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
    return Object.prototype.toString.apply(obj).replace(/\[object (.+)\]/i, '$1').toLowerCase();
};
