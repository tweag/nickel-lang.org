define(function (require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var NickelHighlightRules = function () {

        var constantLanguage = "true|false|null";
        var keywordControl = "switch|import|if|else|then";
        var keywordDeclaration = "let|in";
        var keywordMetavalue = "doc|default"

        var keywordMapper = this.createKeywordMapper({
            "constant.language.nickel": constantLanguage,
            "keyword.control.nickel": keywordControl,
            "keyword.declaration.nickel": keywordDeclaration,
            'keyword.metavalue.nickel': keywordMetavalue,
        }, "identifier");

        // Although Ace supports modal lexing (the next, push and pop rules allow to
        // maintain a state and a stack), we can't encode nickel
        // variable-length delimiter directly with one nice generic rule.
        //
        // We thus generate a rule for lengths 1, 2 and 3 (m#", m##", and m###")
        // plus write a generic rule for size n. The generic rule is wrong for
        // length 5 and above, but this is highly unlikely to be used in
        // practice.

        // Generate the starting rule of a string with variable-length
        // delimiters
        let genQqdoc = length => ({
            token: "string",
            regex: `m${'#'.repeat(length)}\"`,
            next: `qqdoc${length}`,
        });

        // Generate the escape and end rules of a string with variable-length delimiters
        let genQqdocState = length => ({
            [`qqdoc${length}`]: [
                {
                    token: "constant.language.escape",
                    regex: `${'#'.repeat(length)}{`,
                    push: "start",
                }, {
                    token: "string",
                    regex: `"${'#'.repeat(length)}m`,
                    next: "pop",
                }, {
                    defaultToken: "string"
                }]
        });

        this.$rules = {
            "start": [{
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
                regex: "m(#{4,})\"",
                next: "qqdocn"
            },
            genQqdoc(1),
            genQqdoc(2),
            genQqdoc(3), {
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
                token: function (_val, _start, stack) {
                    return stack[1] && stack[1].charAt(0) == "q" ? "constant.language.escape" : "text";
                },
                next: "pop"
            }],
            "qqdocn": [
                {
                    token: "constant.language.escape",
                    regex: "#{4,}{",
                    push: "start"
                }, {
                    token: "string",
                    regex: "\"(#{4,})m",
                    next: "pop"
                }, {
                    defaultToken: "string"
                }],
            ...genQqdocState(1),
            ...genQqdocState(2),
            ...genQqdocState(3),
            "qqstring": [
                {
                    token: "constant.language.escape",
                    regex: "#{",
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
