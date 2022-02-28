module.exports = {
    siteMetadata: {
        title: "Nickel",
        menuLinks: [
            {
                name: 'Getting started',
                link: '/getting-started'
            },
            {
                name: 'Documentation',
                link: '/user-manual'
            },
            {
                name: 'Playground',
                link: '/playground'
            },
        ],
        userManual: {
            sections: [
                {name: "Introduction", link: "/user-manual/introduction"},
                {name: "Syntax", link: "/user-manual/syntax"},
                {name: "Merging", link: "/user-manual/merging"},
                {name: "Correctness", link: "/user-manual/correctness"},
                {name: "Typing", link: "/user-manual/typing"},
                {name: "Contracts", link: "/user-manual/contracts"},
            ],
        },
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
                path: `${__dirname}/src/nickel-manual`,
            },
        },
        `gatsby-plugin-sass`,
        {
          resolve: `gatsby-transformer-remark`,
          options: {
              plugins: [
                  `gatsby-remark-autolink-headers`,
              ]
          },
        },
        {
            resolve: `gatsby-remark-prismjs`,
        },
    ],
};
