exports.onCreateWebpackConfig = ({ _stage, actions, _loaders }) => {
    actions.setWebpackConfig({
        experiments: {
            // This was necessary to have the Nickel WASM REPL work with Webpack
            asyncWebAssembly: true,
        },
    })
};

/* Create redirects from `/user-manual/xxx.md` to `/user-manual/xxx`,
   to make inter-manual links work both as stand-alone Markdown files
   and when embedded in the website. Also create a redirect from `/user-manual(/?)`
   to the introduction.
 */
exports.createPages = async ({ actions, graphql, reporter }) => {
    const result = await graphql(`
        query {
            allMarkdownRemark {
              edges {
                node {
                  frontmatter {
                    slug
                  }
                }
              }
            }
        }`
    );

    result.data.allMarkdownRemark.edges.forEach(edge => {
        const page = edge.node.frontmatter.slug;
        let path = `/user-manual/${page}`;

        actions.createRedirect({
            fromPath: `${path}.md`,
            toPath: path,
            redirectInBrowser: true,
            isPermanent: true
        });
    });

    let redirectToIntro = fromPath => (
        actions.createRedirect({
            fromPath,
            toPath: `/user-manual/introduction`,
            redirectInBrowser: true,
            isPermanent: true,
        })
    );

    redirectToIntro("/user-manual/");
    redirectToIntro("/user-manual");
};
