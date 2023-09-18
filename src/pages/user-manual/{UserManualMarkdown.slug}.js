import * as React from "react"
import Layout from "../../components/layout"
import { graphql } from "gatsby"
import UserManualToc from "../../components/usermanual-toc";
import {useEffect} from "react";

const UserManual = ({data}) => {
    const { userManualMarkdown: {parent: {html, headings, frontmatter} } } = data;
    const sidebarProps = {
        active: frontmatter.slug,
        headings
    };
  return (
      <Layout>
        <div className="container-fluid">
            <div className={"row"}>
                {/*col-md-4 col-lg-3 col-xl-3*/}
                <div className={"col-xl-3 col-lg-4 col-md-5 order-1"}>
                    <UserManualToc {...sidebarProps}/>
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
  query($id: String!) {
    userManualMarkdown(id: { eq: $id }) {
      parent {
        ... on MarkdownRemark {
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
    }
  }
 `;

export default UserManual
