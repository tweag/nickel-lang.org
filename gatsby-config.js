module.exports = {
    siteMetadata: {
        title: "nickel-lang.org",
        menuLinks: [
            {
                name: 'Getting started',
                link: '/getting-started'
            },
            {
                name: 'Documentation',
                link: '/documentation'
            },
            {
                name: 'Playground',
                link: '/playground'
            },
        ]
    },
    plugins: [
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-sharp',
        'gatsby-transformer-sharp',
        'gatsby-plugin-image',
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `markdown-pages`,
                path: `${__dirname}/src/markdown-pages`,
            },
        },
        'gatsby-transformer-remark',
    ],
};
