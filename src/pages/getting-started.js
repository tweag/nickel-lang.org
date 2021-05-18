import * as React from "react"
import Layout from "../components/layout"
import {graphql} from "gatsby"

import "prismjs";
import "prismjs/components/prism-nix";
import "prismjs/components/prism-shell-session";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-yaml";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/plugins/command-line/prism-command-line";
import "prismjs/plugins/command-line/prism-command-line.css";

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