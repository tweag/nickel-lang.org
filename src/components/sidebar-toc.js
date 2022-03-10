import React from "react"
import {graphql, Link, StaticQuery} from "gatsby"
import {Helmet} from "react-helmet"
import Header from "./header"
import Footer from "./footer"

export default function SidebarToc({active, headings}) {
    const subMenu = (name) => {
        if(name.toLowerCase() === active) {
            return (
                <ol>
                    { headings.map(({value, id}, index) => {
                        const key = `sub-${index}-${id}`;
                        return (
                            <li key={key}>
                                <Link key={key} className="link-secondary" to={`#${id}`}>{value}</Link>
                            </li>
                        )})
                    }
                </ol>
            )
        }
    };

    return (
        <StaticQuery
            query={graphql`
      query ManualSections {
        site {
          siteMetadata {
            userManual {
              sections {
                 name
                 link
               }
            }
          } 
        }
      }
    `}
            render={data => (
                <nav id="sidebar" className="sidebar sticky-top">
                    <div className="sidebar-scroll-box">
                        <div className="sidebar-header">
                            <h3>User Manual</h3>
                        </div>

                        <ol type="I">
                            {data.site.siteMetadata.userManual.sections.map((section, index) => {
                                const key = `sec-${index}-${section.name}`;
                                return (
                                    <li key={key}>
                                        <Link key={key} className="link-primary" activeClassName="sidebar-link-active" to={section.link}>{section.name}</Link>
                                        { subMenu(section.name) }
                                    </li>
                                )
                            })}
                        </ol>
                    </div>
                </nav>
            )}
        />
    )
}
