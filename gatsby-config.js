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
                link: '#'
            },
        ]
    },
    plugins: [
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-sharp',
        'gatsby-transformer-sharp',
        'gatsby-plugin-image',
    ],
};
