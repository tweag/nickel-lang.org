import * as React from "react"
import Layout from "../../components/layout"
import { graphql } from "gatsby"
import SidebarToc from "../../components/stdlib-toc";
import {useEffect} from "react";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import nickelLanguageDefinition from "../../prism/nickel";

import ReactMarkdown from 'react-markdown';

const Stdlib = ({data}) => {
    const object = JSON.parse(data.stdlibSection.internal.content);
    const slug = data.stdlibSection.slug; 
    console.log(object)
    useEffect(() => {
        Prism.languages.nickel = nickelLanguageDefinition;
        Prism.highlightAll();
    }, []);
    // const { stdlibMarkdown: { parent: {html, headings} } } = data;
    const sidebarProps = {
        // active: frontmatter.slug,
    };

    const markdownComponents = {
        h1: 'h4',
        h2: 'h5',
        h3: 'h6',
        h4: 'h6',
        h5: 'h6',
        h6: 'h6',
    };
  return (
      <Layout>
        <div className="container-fluid">
            <div className={"row"}>
                {/*col-md-4 col-lg-3 col-xl-3*/}
                <div className={"col-xl-3 col-lg-4 col-md-5 order-1"}>
                    <SidebarToc {...sidebarProps}/>
                </div>
                <div className={"col-xl-9 col-lg-8 col-md-7 order-2"}>
                    <div className={"container content-main-container content documentation-page"}>
                        <h2>{slug.charAt(0).toUpperCase() + slug.slice(1)}</h2>
                        {Object.entries(object[`${slug}`].fields).map(([k, v]) => {
                            return (
                                <div>
                                <h3>{k}</h3>
                                {v.types ? (<h4><code className={'language-nickel'}>{k} : {v.types}</code></h4>) : ""}
                                {v.contracts.map((ctr) => {
                                    return (<h4><code className={'language-nickel'}>{k} | {ctr}</code></h4>);
                                })}
                                <ReactMarkdown components={markdownComponents}>
                                {v.documentation}
                                </ReactMarkdown>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
      </Layout>
  )
};

export const pageQuery = graphql`
  query($id: String) {
    stdlibSection(id: { eq: $id }) {
        slug
        internal { content }
    }
  }
 `;

export default Stdlib
