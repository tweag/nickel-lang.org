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
