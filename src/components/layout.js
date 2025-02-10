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
                            {name: 'description', content: 'Sample'},
                            {name: 'keywords', content: 'sample, something'},
                        ]}
                    >
                    </Helmet>
                    <Header menuLinks={data.site.siteMetadata.menuLinks}/>
                    <div>
                        {children}
                    </div>
                    <Footer/>
                </React.Fragment>
            )}
        />
    )
}

/**
 * A variant of Layout that provides two independently-scrollable columns and no footer.
 */
export function LayoutWithScrollableSidebar({ children, sidebar }) {
  return (
    <StaticQuery
      query={graphql`
        query SiteData {
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
      render={(data) => (
        <React.Fragment>
          <Helmet
            title={"Nickel"}
            meta={[
              { name: "description", content: "Sample" },
              { name: "keywords", content: "sample, something" },
            ]}
          ></Helmet>
          <Header menuLinks={data.site.siteMetadata.menuLinks} />
          <div className={"container-fluid"}>
            <div className={"row"}>
              <div
                className={
                  "col-xl-3 col-lg-4 col-md-5 order-1 scrollable-column"
                }
              >
                <div class="column-content">{sidebar}</div>
              </div>
              <div
                className={
                  "col-xl-9 col-lg-8 col-md-7 order-2 scrollable-column"
                }
              >
                <div class="column-content">{children}</div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    />
  );
}
