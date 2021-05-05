define(function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var NickelHighlightRules = function() {

        var constantLanguage = "true|false|null";
        var keywordControl = "switch|import|if|else|then";
        var keywordDeclaration = "let|in";
        var keywordMetavalue = "doc|default"

        var keywordMapper = this.createKeywordMapper({
            "constant.language.nickel": constantLanguage,
            "keyword.control.nickel": keywordControl,
            "keyword.declaration.nickel": keywordDeclaration
        }, "identifier");

        this.$rules = {
            "start": [{
                    token: "comment",
                    regex: /#.*$/
                }, {
                    token: "comment",
                    regex: /\/\/.*$/
                }, {
                    regex: "(==|!=|<=?|>=?)",
                    token: ["keyword.operator.comparison.nickel"]
                }, {
                    regex: "=",
                    token: "keyword.operator.assignment.nickel"
                }, {
                    token: "string",
                    regex: "m(#+)\"",
                    next: "qqdoc"
                }, {
                    token: "string",
                    regex: '"',
                    push: "qqstring"
                }, {
                    token: "constant.numeric", // hex
                    regex: "0[xX][0-9a-fA-F]+\\b"
                }, {
                    token: "constant.numeric", // float
                    regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
                }, {
                    token: keywordMapper,
                    regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
                }, {
                    regex: "}",
                    token: function(val, start, stack) {
                        return stack[1] && stack[1].charAt(0) == "q" ? "constant.language.escape" : "text";
                    },
                    next: "pop"
                }],
            "qqdoc": [
                {
                    token: "constant.language.escape",
                    regex: /#\{/,
                    push: "start"
                }, {
                    token: "string",
                    regex: "''",
                    next: "pop"
                }, {
                    defaultToken: "string"
                }],
            "qqstring": [
                {
                    token: "constant.language.escape",
                    regex: /#\{/,
                    push: "start"
                }, {
                    token: "string",
                    regex: '"',
                    next: "pop"
                }, {
                    defaultToken: "string"
                }],
        };

        this.normalizeRules();
    };

    oop.inherits(NickelHighlightRules, TextHighlightRules);

    exports.NickelHighlightRules = NickelHighlightRules;
});
