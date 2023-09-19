const nickelLanguageDefinition = require('./src/prism/nickel.js');

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
                name: 'Standard Library',
                link: '/stdlib'
            },
            {
                name: 'Playground',
                link: '/playground'
            },
        ],
        userManual: {
            sections: [
                {name: "Introduction", link: "/user-manual/introduction"},
                {name: "Tutorial", link: "/user-manual/tutorial"},
                {name: "Syntax", link: "/user-manual/syntax"},
                {name: "Merging", link: "/user-manual/merging"},
                {name: "Correctness", link: "/user-manual/correctness"},
                {name: "Typing", link: "/user-manual/typing"},
                {name: "Contracts", link: "/user-manual/contracts"},
                {name: "Types vs. Contracts", link: "/user-manual/types-vs-contracts"},
            ],
        },
        stdlib: {
            link: '/stdlib'
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
                name: `user-manual`,
                path: `${__dirname}/src/nickel-manual`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `stdlib-doc`,
                path: `${__dirname}/src/nickel-stdlib-doc`,
            },
        },
        `gatsby-plugin-sass`,
        {
          resolve: `gatsby-transformer-remark`,
          options: {
              plugins: [
                `gatsby-remark-autolink-headers`,
                {
                    resolve: `gatsby-remark-prismjs`,
                    options: {
                        aliases: {
                            'nickel#lines': 'nickel',
                            'nickel#repl': 'nickel',
                            'nickel#parse': 'nickel',
                            'nickel#no-check': 'nickel',
                        },
                        languageExtensions: [
                            {
                                language: 'nickel',
                                definition: nickelLanguageDefinition
                            }
                        ]
                    }
                },
                {
                    resolve: `gatsby-remark-classes`,
                    options: {
                        classMap: {
                            link: "link-primary",
                            table: "table table-striped markdown-table",
                        }
                    }
                },
                `gatsby-remark-mangle-links`
              ],
          },
        },
        `gatsby-transformer-json`,
    ],
};
