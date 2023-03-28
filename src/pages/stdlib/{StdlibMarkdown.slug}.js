import * as React from "react"
import Layout from "../../components/layout"
import { graphql } from "gatsby"
import SidebarToc from "../../components/sidebar-toc";
import {useEffect} from "react";

import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-yaml";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/plugins/command-line/prism-command-line";
import "prismjs/plugins/command-line/prism-command-line.css";
import nickelLanguageDefinition from "../../prism/nickel";

const Stdlib = ({data}) => {
    useEffect(() => {
        Prism.languages.nickel = nickelLanguageDefinition;
        Prism.highlightAll();
    }, []);
    const { stdlibMarkdown: { parent: {html, headings, frontmatter} } } = data; // data.markdownRemark holds your post data
    const sidebarProps = {
        // active: frontmatter.slug,
        headings
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
                    <div className={"container content-main-container content documentation-page"} dangerouslySetInnerHTML={{ __html: html }}>
                    </div>
                </div>
            </div>
        </div>
      </Layout>
  )
};

export const pageQuery = graphql`
  query($id: String) {
    stdlibMarkdown(id: { eq: $id }) {
      parent {
        ... on MarkdownRemark {
          html
          headings(depth: h2) {
            id
            value
          }
        }
      }
    }
  }
 `;

export default Stdlib
