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
    const name = data.stdlibSection.name; 
    const sidebarProps = {
        active: slug,
        headings: object,
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
