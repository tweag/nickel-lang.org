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

    let redirectToStdlibStd = fromPath => (
        actions.createRedirect({
            fromPath,
            toPath: `/stdlib/std`,
            redirectInBrowser: true,
            isPermanent: true,
        })
    );

    redirectToStdlibStd("/stdlib/");
    redirectToStdlibStd("/stdlib");
};

// Make a StdlibSection node in the format expected by the page generation code
// We pass the original content as JSON so we can query the entire thing at once instead of havin gatsby integrate it into the GraphQL schema
const makeStdlibSection = ({ actions, createNodeId, createContentDigest, node, slug, name, content }) => {
    newNode = {
        id: createNodeId(`${node.id} >>> Nickel Stdlib Doc ${slug}`),
        parent: node.id,
        slug,
        name,
        internal: {
            contentDigest: createContentDigest(content),
            content: JSON.stringify(content),
            type: "StdlibSection"
        }
    };
    actions.createNode(newNode);
    actions.createParentChildLink({ parent: node, child: newNode })
}

exports.onCreateNode = ({ node, getNode, createNodeId, createContentDigest, actions }) => {
    // We make a new node type "UserManualMarkdown" to make the filesystem query in `src/pages/user-manual/{UserManualMarkdown.slug}.js` more specific
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

    // Preprocess the JSON stdlib documentation data that we get from Nickel into a format that makes it easier to handle
    if (node.internal.type === "NickelStdlibDocJson") {
        const toplevelName = getNode(node.parent).name;
        docsContent = JSON.parse(getNode(node.parent).internal.content);

        // Since we don't want to have every module displayed under the `std` namespace on the website, we split out those top-level entries which have subfields.
        toplevelFields = Object.fromEntries(Object.entries(docsContent).filter(([key, value]) => !value.fields));

        makeStdlibSection({
            actions, createNodeId, createContentDigest,
            node,
            slug: toplevelName,
            name: toplevelName,
            content: toplevelFields,
        })

        // What's left are the stdlib functions living in the top-level `std` namespace
        Object.entries(docsContent).filter(([key, value]) => !!value.fields).forEach(([slug, value]) => {
            makeStdlibSection({
                actions, createNodeId, createContentDigest,
                node,
                slug: `${toplevelName}-${slug}`,
                name: `${toplevelName}.${slug}`,
                content: value.fields,
            })
        });
    }
}
