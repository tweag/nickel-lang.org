import React from "react"
import {graphql, Link, StaticQuery} from "gatsby"
import {Helmet} from "react-helmet"
import Header from "./header"
import Footer from "./footer"

export default function SidebarToc({active, headings}) {
    const subMenu = ({headings, toPrefix, keyPrefix}) => {
            return (
                <ul>
                    { Object.entries(headings).sort(([k1, v1], [k2, v2]) => k1.localeCompare(k2)).map(([id, field]) => {
                        const key = `${keyPrefix}-${id}`;
                        const to = `${toPrefix}${toPrefix ? "." : ""}${id}`;
                        return (
                            <li key={key}>
                                <Link key={`link-${key}`} className="link-secondary" to={`#${to}`}>{id}</Link>
                                <ul>
                                {field.fields ? subMenu({
                                    toPrefix: to,
                                    headings: field.fields,
                                    keyPrefix: `${keyPrefix}-${id}`,
                                }) : ""}
                                </ul>
                            </li>
                        )})
                    }
                </ul>
            )
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
                                        {
                                            (slug === active) ?
                                                subMenu({
                                                    toPrefix: "",
                                                    headings,
                                                    keyPrefix: `${key}-sub`,
                                                })
                                            : ""
                                        }
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
