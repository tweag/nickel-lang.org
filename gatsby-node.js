exports.onCreateWebpackConfig = ({ stage, actions }) => {
    actions.setWebpackConfig({
        experiments: {
            syncWebAssembly: true,
        },
    })
}
