const path = require('path')

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
                  parent {
                    ... on File {
                      sourceInstanceName
                    }
                  }            
                }
              }
            }
        }`
    );

    result.data.allMarkdownRemark.edges.forEach(edge => {
        if (edge.node.parent.sourceInstanceName === "markdown-pages") {
            const page = edge.node.frontmatter.slug;
            let page_path = `/user-manual/${page}`;

            actions.createRedirect({
                fromPath: `${page_path}.md`,
                toPath: page_path,
                redirectInBrowser: true,
                isPermanent: true
            });
        }
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

    let redirectToStdlibArray = fromPath => (
        actions.createRedirect({
            fromPath,
            toPath: `/stdlib/array`,
            redirectInBrowser: true,
            isPermanent: true,
        })
    );

    redirectToStdlibArray("/stdlib/");
    redirectToStdlibArray("/stdlib");
};

exports.onCreateNode = ({ node, getNode, createNodeId, actions }) => {
    if (node.internal.type === "MarkdownRemark" && getNode(node.parent).sourceInstanceName === "user-manual") {
        newNode = {
            id: createNodeId(`Nickel User Manual ${node.id}`),
            parent: node.id,
            slug: node.frontmatter.slug,
            internal: {
                contentDigest: node.internal.contentDigest,
                type: "UserManualMarkdown",
            },
        };
        actions.createNode(newNode);
        actions.createParentChildLink({ parent: node, child: newNode })
    }

    if (node.internal.type == "NickelStdlibDocJson") {
        const slug = getNode(node.parent).name;

        newNode = {
            id: createNodeId(`Nickel Stdlib Doc ${node.id}`),
            parent: node.id,
            slug,
            internal: {
                contentDigest: node.internal.contentDigest,
                content: getNode(node.parent).internal.content,
                type: "StdlibSection"
            }
        }
        actions.createNode(newNode);
        actions.createParentChildLink({ parent: node, child: newNode })
    }
}
