import React from "react"
import {graphql, StaticQuery} from "gatsby"
import {Helmet} from "react-helmet"
import Header from "./header"

/**
 * A variant of Layout that provides two independently-scrollable columns and no footer.
 *
 * On small screens, drops the two columns back down to a single column with a single
 * scroll area.
 */
export default function Layout({ children, sidebar }) {
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
      render={(data) => (
        <React.Fragment>
          <Helmet
            title={data.site.siteMetadata.title}
            meta={[
              { name: "description", content: data.site.siteMetadata.description },
              { name: "keywords", content: data.site.siteMetadata.keywords },
            ]}
          ></Helmet>
          <Header menuLinks={data.site.siteMetadata.menuLinks} />
          <div className={"container-fluid"}>
            <div className={"row"}>
              <div
                className={
                  "col-xl-3 col-lg-4 col-md-5 col-12 order-1 scrollable-column-md"
                }
              >
                <div class="column-content">{sidebar}</div>
              </div>
              <div
                className={
                  "col-xl-9 col-lg-8 col-md-7 col-12 order-2 scrollable-column-md"
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

