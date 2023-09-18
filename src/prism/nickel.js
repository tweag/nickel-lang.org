/**
 * Simple language definition for Nickel to use with the Prism highlighting library.
 * @type {{number: RegExp, string: RegExp[], builtin: RegExp, punctuation: RegExp[], comment: RegExp, keyword: RegExp[], operator: RegExp[]}}
 */
const nickel = {
    comment: /#.+/,
    string: [
        { pattern: /(m|[a-zA-Z][_a-zA-Z0-9-']*-s)(%+)"(.|\n)*?"\2/, greedy: true},
        { pattern: /".*?"/, greedy: true},
    ],
    operator: [
        />/, />=/, /</, /<=/, /&/, /==/, /&&/, /\|\|/, /!/, /\+/, /@/, /-/, /\+\+/, /\*/, /\//,
    ],
    keyword: /\b(?:let|rec|in|fun|match|forall|if|then|else|doc|default|force|priority|import|not_exported|optional)\b/,
    punctuation: [
        /[:/,;{}()=|]/,
        /=>/,
        /->/,
    ],
    number: /\b[0-9]*\.?[0-9]+\b/,
    builtin: /\b(?:Dyn|Number|Bool|String|Array)\b/,
    type: /[A-Z][a-zA-Z0-9_-]*/,
};

module.exports = nickel;
