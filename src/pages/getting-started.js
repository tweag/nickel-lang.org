import * as React from "react"
import Layout from "../components/layout"
import {graphql} from "gatsby"

import "prismjs";
import "prismjs/themes/prism-tomorrow.css";

// markup
const IndexPage = (data) => {
    return (
        <Layout>
            <main className="container main-container">
                <div
                    dangerouslySetInnerHTML={{ __html: data.data.markdownRemark.html }}
                />
            </main>
        </Layout>
    );
};

export const pageQuery = graphql`
  query IndexPageQuery {
    markdownRemark(frontmatter: { page: { eq: "getting-started" } }) {
      html
    }
  }
`;

export default IndexPage