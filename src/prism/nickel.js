/**
 * Simple language definition for Nickel to use with the Prism highlighting library.
 * @type {{number: RegExp, string: RegExp[], builtin: RegExp, punctuation: RegExp[], comment: RegExp, keyword: RegExp[], operator: RegExp[]}}
 */
const nickel = {
    comment: /#.+/,
    string: [
        { pattern: /m(%+)"(.|\n)*?"\1/, greedy: true},
        { pattern: /".*?"/, greedy: true},
    ],
    operator: [
        />/, />=/, /</, /<=/, /&/, /==/, /&&/, /\|\|/, /!/, /\+/, /@/, /-/, /\+\+/, /\*/, /\//,
    ],
    keyword: /\b(?:let|in|fun|match|forall|if|then|else|doc|default|force|priority|import)\b/,
    punctuation: [
        /[:/,;{}()=|]/,
        /=>/,
        /->/,
    ],
    number: /\b[0-9]*\.?[0-9]+\b/,
    builtin: /\b(?:Dyn|Number|Bool|String|Array)\b/,
    type: /[A-Z][a-zA-Z0-9_-]*/,
};

export default nickel;