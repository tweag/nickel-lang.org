import * as React from "react"
import Layout from "../../components/layout"
import { graphql } from "gatsby"
import SidebarToc from "../../components/stdlib-toc";
import {useEffect} from "react";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import nickelLanguageDefinition from "../../prism/nickel";

import ReactMarkdown from 'react-markdown';

// Icon taken from gatsby-remark-autolink-headers at https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-remark-autolink-headers/src/index.js
const AnchorIcon = () => {
    return (
       <svg aria-hidden="true" focusable="false" height="16" version="1.1" viewBox="0 0 16 16" width="16">
        <path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z">
        </path>
       </svg>     
    );
}

const Stdlib = ({data}) => {
    const object = JSON.parse(data.stdlibSection.internal.content);
    const {slug, name} = data.stdlibSection; 
    const sidebarProps = {
        active: slug,
        headings: object,
    };

    const HeaderWithTypes = ({id, name, types, contracts}) => {
        const Header = ({content}) => {
            return (
                <h3 id={id} style={{'position': 'relative'}}>
                    <a href={`#${id}`} aria-label={`${id} permalink`} class={`anchor before`}><AnchorIcon /></a>
                    <code className={'language-nickel'}>{content}</code>
                </h3>
            );
        }
        
        if(!types && !contracts.length) {
            return (<Header content={name} />);
        }

        if(types && !contracts.length) {
            return (<Header content={`${name} : ${types}`} />);
        }

        if(!types && contracts) {
            return (
                <React.Fragment>
                <Header content={`${name} | ${contracts[0]}`} />
                {contracts.slice(1).map((ctr) => {
                    return (<h4><code className={'language-nickel'}>{name} | {ctr}</code></h4>);
                })}
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
            <Header content={`${name} : ${types}`} />
            {contracts.map((ctr) => {
                return (<h4><code className={'language-nickel'}>{name} | {ctr}</code></h4>);
            })}
            </React.Fragment>
        );
    };

    const DocEntry = ({prefix, k, v}) => {
        useEffect(() => {
            Prism.languages.nickel = nickelLanguageDefinition;
            Prism.highlightAll();
        }, []);
        const markdownComponents = {
            h1: 'h4',
            h2: 'h5',
            h3: 'h6',
            h4: 'h6',
            h5: 'h6',
            h6: 'h6',
        };
        const id = `${prefix}${prefix ? "." : ""}${k}`;
        return (
            <React.Fragment>
            <HeaderWithTypes id={id} name={id} types={v.types} contracts={v.contracts}/>
            <ReactMarkdown components={markdownComponents}>
            {v.documentation}
            </ReactMarkdown>
            <hr/>
            <DocEntries prefix={id} fields={v.fields} />
            </React.Fragment>
        );
    };

    const DocEntries = ({prefix, fields}) => {
        return Object.entries(fields ? fields : {}).sort(([k1, v1], [k2, v2]) => k1.localeCompare(k2)).map(([k, v]) => {
            return (
                <React.Fragment>
                <DocEntry prefix={prefix} k={k} v={v} />
                </React.Fragment>
            );
        })
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
                        <h2>{name}</h2>
                        <DocEntries prefix={``} fields={object} />
                    </div>
                </div>
            </div>
        </div>
      </Layout>
  )
                        // <h2>{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
};

export const pageQuery = graphql`
  query($id: String) {
    stdlibSection(id: { eq: $id }) {
        slug
        name
        internal { content }
    }
  }
 `;

export default Stdlib
