const visit = require('unist-util-visit');

module.exports = ({ markdownAST }) => {
  visit(markdownAST, 'link', node => {
    if (node.url.match(/^\.\//)) {
      node.url = node.url.replace(/^\.\//, "/user-manual/").replace(/\.md$/, "");
    }
  });
  return null;
};