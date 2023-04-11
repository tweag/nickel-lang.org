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
    useEffect(() => {
        Prism.languages.nickel = nickelLanguageDefinition;
        Prism.highlightAll();
    }, []);
    // const { stdlibMarkdown: { parent: {html, headings} } } = data;
    const sidebarProps = {
        active: slug,
        headings: object[slug].fields,
    };

    const HeaderWithTypes = ({id, name, types, contracts}) => {
        if(!types && !contracts.length) {
            return (<h3 id={id}><code className={'language-nickel'}>{name}</code></h3>);
        }

        if(types && !contracts.length) {
            return (<h3 id={id}><code className={'language-nickel'}>{name} : {types}</code></h3>);
        }

        if(!types && contracts) {
            return (
                <React.Fragment>
                <h3 id={id}><code className={'language-nickel'}>{name} | {contracts[0]}</code></h3>
                {contracts.slice(1).map((ctr) => {
                    return (<h4><code className={'language-nickel'}>{name} | {ctr}</code></h4>);
                })}
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
            <h3 id={id}><code className={'language-nickel'}>{name} : {types}</code></h3>
            {contracts.map((ctr) => {
                return (<h4><code className={'language-nickel'}>{name} | {ctr}</code></h4>);
            })}
            </React.Fragment>
        );
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
                        {Object.entries(object[`${slug}`].fields).sort(([k1, v1], [k2, v2]) => k1.localeCompare(k2)).map(([k, v]) => {
                            return (
                                <React.Fragment>
                                <HeaderWithTypes id={k} name={k} types={v.types} contracts={v.contracts}/>
                                <ReactMarkdown components={markdownComponents}>
                                {v.documentation}
                                </ReactMarkdown>
                                <hr/>
                                </React.Fragment>
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
        subfields {
            value
            id
        }
        internal { content }
    }
  }
 `;

export default Stdlib
