/**
 * Simple language definition for Nickel to use with the Prism highlighting library.
 * @type {{number: RegExp, string: RegExp[], builtin: RegExp, punctuation: RegExp[], comment: RegExp, keyword: RegExp[], operator: RegExp[]}}
 */
const nickel = {
    comment: /#.+/,
    string: [
        { pattern: /m(%+)"(.|\n)*?"\1m/, greedy: true},
        { pattern: /".*?"/, greedy: true},
    ],
    operator: [
        />/, />=/, /</, /<=/, /&/, /==/, /&&/, /\|\|/, /!/, /\+/, /@/, /-/, /\+\+/, /\*/, /\//,
    ],
    keyword: /\b(?:let|in|fun|switch|forall|if|then|else|doc|default|import)\b/,
    punctuation: [
        /[:/,;{}()=|]/,
        /=>/,
        /->/,
    ],
    number: /\b[0-9]*\.?[0-9]+\b/,
    builtin: /\b(?:Dyn|Num|Bool|Str|Array)\b/,
    type: /[A-Z][a-zA-Z0-9_-]*/,
};

export default nickel;