/**
 * @fileoverview An object that creates fix commands for rules.
 * @author Nicholas C. Zakas
 * @copyright 2015 Nicholas C. Zakas. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// none!

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Creates code fixing commands for rules.
 * @constructor
 */
function RuleFixer() {
    Object.freeze(this);
}

RuleFixer.prototype = {
    constructor: RuleFixer,

    /**
     * Creates a fix command that inserts text at the specified index in the source text.
     * @param {int} index The 0-based index at which to insert the new text.
     * @param {string} text The text to insert.
     * @returns {Object} The fix command.
     */
    insertText: function(index, text) {
        return {
            range: [index, index],
            text: text
        };
    },

    /**
     * Creates a fix command that inserts text after the specified range in the source text.
     * The fix is not applied until applyFixes() is called.
     * @param {int[]} range The range to replace, first item is start of range, second
     *      is end of range.
     * @param {string} text The text to insert.
     * @returns {Object} The fix command.
     */
    insertTextAfter: function(range, text) {
        return this.insertText(range[1], text);
    },

    /**
     * Creates a fix command that inserts text before the specified range in the source text.
     * The fix is not applied until applyFixes() is called.
     * @param {int[]} range The range to replace, first item is start of range, second
     *      is end of range.
     * @param {string} text The text to insert.
     * @returns {Object} The fix command.
     */
    insertTextBefore: function(range, text) {
        return this.insertText(range[0], text);
    },

    /**
     * Creates a fix command that replaces text at the specified range in the source text.
     * The fix is not applied until applyFixes() is called.
     * @param {int[]} range The range to replace, first item is start of range, second
     *      is end of range.
     * @param {string} text The text to insert.
     * @returns {Object} The fix command.
     */
    replaceText: function(range, text) {
        return {
            range: range,
            text: text
        };
    },

    /**
     * Creates a fix command that removes the specified range of text from the source.
     * The fix is not applied until applyFixes() is called.
     * @param {int[]} range The range to remove, first item is start of range, second
     *      is end of range.
     * @returns {Object} The fix command.
     */
    removeText: function(range) {
        return {
            range: range,
            text: ""
        };
    }

};


module.exports = RuleFixer;
