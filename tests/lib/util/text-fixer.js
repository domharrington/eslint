/**
 * @fileoverview Abstraction of JavaScript source code.
 * @author Nicholas C. Zakas
 * @copyright 2015 Nicholas C. Zakas. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    espree = require("espree"),
    sinon = require("sinon"),
    eslint = require("../../../lib/eslint"),
    TextFixer = require("../../../lib/util/text-fixer");

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

var TEST_CODE = "var answer = 6 * 7;";
var INSERT_AT_END = {
        message: "End",
        fix: {
            range: [ TEST_CODE.length, TEST_CODE.length ],
            text: "// end"
        }
    },
    INSERT_AT_START = {
        message: "Start",
        fix: {
            range: [ 0, 0 ],
            text: "// start\n"
        }
    },
    INSERT_IN_MIDDLE = {
        message: "Multiply",
        fix: {
            range: [ 13, 13 ],
            text: "5 *"
        }
    },
    REPLACE_ID = {
        message: "foo",
        fix: {
            range: [4, 10],
            text: "foo"
        }
    },
    REPLACE_VAR = {
        message: "let",
        fix: {
            range: [0, 3],
            text: "let"
        }
    },
    REPLACE_NUM = {
        message: "5",
        fix: {
            range: [13, 14],
            text: "5"
        }
    },
    REMOVE_START = {
        message: "removestart",
        fix: {
            range: [0, 4],
            text: ""
        }
    },
    REMOVE_MIDDLE = {
        message: "removemiddle",
        fix: {
            range: [5, 10],
            text: ""
        }
    },
    REMOVE_END = {
        message: "removeend",
        fix: {
            range: [14, 18],
            text: ""
        }
    };

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("TextFixer", function() {


    describe("applyFixes()", function() {

        var fixer;

        beforeEach(function() {
            fixer = new TextFixer();
        });

        describe("Text Insertion", function() {

            it("should insert text at the end of the code", function() {
                var result = fixer.applyFixes(TEST_CODE, [ INSERT_AT_END ]);
                assert.equal(result.output, TEST_CODE + INSERT_AT_END.fix.text);
                assert.equal(result.messages.length, 0);
            });

            it("should insert text at the beginning of the code", function() {
                var result = fixer.applyFixes(TEST_CODE, [ INSERT_AT_START ]);
                assert.equal(result.output, INSERT_AT_START.fix.text + TEST_CODE);
                assert.equal(result.messages.length, 0);
            });

            it("should insert text in the middle of the code", function() {
                var result = fixer.applyFixes(TEST_CODE, [ INSERT_IN_MIDDLE ]);
                assert.equal(result.output, TEST_CODE.replace("6 *", INSERT_IN_MIDDLE.fix.text + "6 *"));
                assert.equal(result.messages.length, 0);
            });

            it("should insert text at the beginning, middle, and end of the code", function() {
                var result = fixer.applyFixes(TEST_CODE, [ INSERT_IN_MIDDLE, INSERT_AT_START, INSERT_AT_END ]);
                assert.equal(result.output, INSERT_AT_START.fix.text + TEST_CODE.replace("6 *", INSERT_IN_MIDDLE.fix.text + "6 *") + INSERT_AT_END.fix.text);
                assert.equal(result.messages.length, 0);
            });

        });


        describe("Text Replacement", function() {

            it("should replace text at the end of the code", function() {
                var result = fixer.applyFixes(TEST_CODE, [ REPLACE_VAR ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, TEST_CODE.replace("var", "let"));
            });

            it("should replace text at the beginning of the code", function() {
                var result = fixer.applyFixes(TEST_CODE, [ REPLACE_ID ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, TEST_CODE.replace("answer", "foo"));
            });

            it("should replace text in the middle of the code", function() {
                var result = fixer.applyFixes(TEST_CODE, [ REPLACE_NUM ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, TEST_CODE.replace("6", "5"));
            });

            it("should replace text at the beginning and end of the code", function() {
                var result = fixer.applyFixes(TEST_CODE, [ REPLACE_ID, REPLACE_VAR, REPLACE_NUM ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, "let foo = 5 * 7;");
            });

        });

        describe("Text Removal", function() {

            it("should remove text at the start of the code", function() {
                var result = fixer.applyFixes(TEST_CODE, [ REMOVE_START ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, TEST_CODE.replace("var ", ""));
            });

            it("should remove text in the middle of the code", function() {
                var result = fixer.applyFixes(TEST_CODE, [ REMOVE_MIDDLE ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, TEST_CODE.replace("answer", "a"));
            });

            it("should remove text towards the end of the code", function() {
                var result = fixer.applyFixes(TEST_CODE, [ REMOVE_END ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, TEST_CODE.replace(" * 7", ""));
            });

            it("should remove text at the beginning, middle, and end of the code", function() {
                var result = fixer.applyFixes(TEST_CODE, [ REMOVE_END, REMOVE_START, REMOVE_MIDDLE ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, "a = 6;");
            });
        });

        describe("Combination", function() {

            it("should replace text at the beginning, remove text in the middle, and insert text at the end", function() {
                var result = fixer.applyFixes(TEST_CODE, [ INSERT_AT_END, REMOVE_END, REPLACE_VAR ]);
                assert.equal(result.messages.length, 0);
                assert.equal(result.output, "let answer = 6;// end");
            });

            it("should only apply one fix when ranges overlap", function() {
                var result = fixer.applyFixes(TEST_CODE, [ REMOVE_MIDDLE, REPLACE_ID ]);
                assert.equal(result.messages.length, 1);
                assert.equal(result.messages[0].message, "foo");
                assert.equal(result.output, TEST_CODE.replace("answer", "a"));
            });

        });

    });

});
