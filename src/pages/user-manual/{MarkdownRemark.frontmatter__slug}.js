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

const UserManual = ({data}) => {
    useEffect(() => {
        Prism.languages.nickel = nickelLanguageDefinition;
        Prism.highlightAll();
    }, []);
    const { markdownRemark: {html, headings, frontmatter} } = data; // data.markdownRemark holds your post data
    const sidebarProps = {
        active: frontmatter.slug,
        headings
    };
  return (
      <Layout>
        <div className="container-fluid">
            <div className={"row"}>
                {/*col-md-4 col-lg-3 col-xl-3*/}
                <div className={"col-xl-auto col-lg-3 col-md-4 order-1"}>
                    <SidebarToc {...sidebarProps}/>
                </div>
                <div className={"col-xl col-lg-9 col-md-8 order-2"}>
                    <div className={"container content-main-container content all-links-primary"} dangerouslySetInnerHTML={{ __html: html }}>
                    </div>
                </div>
            </div>
        </div>
      </Layout>
  )
};

export const pageQuery = graphql`
  query($id: String!) {
    markdownRemark(id: {eq: $id }) {
      html
      frontmatter {
          slug
      }
      headings(depth: h2) {
          value
          id
      }
    }
  }
 `;

export default UserManual
