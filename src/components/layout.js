import React from "react"
import {graphql, StaticQuery} from "gatsby"
import {Helmet} from "react-helmet"
import Header from "./header"
import Footer from "./footer"

export default function Layout({children}) {
    return (
        <StaticQuery
            query={graphql`
      query SiteData {
        site {
          siteMetadata {
            title
            description
            keywords
            menuLinks {
              name
              link
            }
          }
        }
      }
    `}
            render={data => (
                <React.Fragment>
                    <Helmet
                        title={data.site.siteMetadata.title}
                        meta={[
                            {name: "description", content: data.site.siteMetadata.description},
                            {name: "keywords", content: data.site.siteMetadata.keywords},
                        ]}
                    >
                    </Helmet>
                    <Header menuLinks={data.site.siteMetadata.menuLinks} />
                    <div>
                        {children}
                    </div>
                    <Footer />
                </React.Fragment>
            )}
        />
    )
}

