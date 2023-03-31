import React from "react"
import {graphql, Link, StaticQuery} from "gatsby"
import {Helmet} from "react-helmet"
import Header from "./header"
import Footer from "./footer"

export default function SidebarToc({active, headings}) {
    const subMenu = (name) => {
        if(name === active) {
            return (
                <ul>
                    { headings.map(({value, id}, index) => {
                        const key = `sub-${index}-${id}`;
                        return (
                            <li key={key}>
                                <Link key={key} className="link-secondary" to={`#${id}`}>{value}</Link>
                            </li>
                        )})
                    }
                </ul>
            )
        }
    };

    return (
        <StaticQuery
            query={graphql`
              query sections {
                site {
                    siteMetadata {
                        stdlib {
                            link
                        }
                    }
                }
                allStdlibSection(sort: {fields: slug}) {
                    edges {
                        node {
                            slug
                        }
                    }
                  }
                }
            `}
            render={data => (
                <nav id="sidebar" className="sidebar sticky-top">
                    <div className="sidebar-scroll-box">
                        <div className="sidebar-header">
                            <h3>Standard Library</h3>
                        </div>

                        <ul>
                            {data.allStdlibSection.edges.map(({node: { slug }}) => {
                                const key = `sec-stdlib-${slug}`;
                                return (
                                    <li key={key}>
                                        <Link className="link-primary" activeClassName="sidebar-link-active" to={`${data.site.siteMetadata.stdlib.link}/${slug}`}>{slug}</Link>
                                        { subMenu(slug) }
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </nav>
            )}
        />
    )
}
