import React from "react"
import { StaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"
import Header from "./header"

export default function Layout({ children }) {
  return (
      <StaticQuery
          query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
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
                      title={'Nickel'}
                      meta={[
                          { name: 'description', content: 'Sample' },
                          { name: 'keywords', content: 'sample, something' },
                      ]}
                  >
                  </Helmet>
                  <Header siteTitle={data.site.siteMetadata.title} menuLinks={data.site.siteMetadata.menuLinks} />
                  <div
                      style={{
                          margin: '0 auto',
                          maxWidth: 960,
                          padding: '0px 1.0875rem 1.45rem',
                          paddingTop: 0,
                      }}
                  >
                      {children}
                  </div>
              </React.Fragment>
          )}
      />
  )
}