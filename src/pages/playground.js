import * as React from "react"
import Layout from "../components/layout"
import {Helmet} from "react-helmet";
import XTerm from "../components/terminal";
import Editor from "../components/editor";
import { FitAddon } from "xterm-addon-fit/src/FitAddon";

// markup
const IndexPage = () => {
    return (
        <Layout>
            <Helmet>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/xterm/2.6.0/xterm.css"/>
            </Helmet>
                <div className={"container-fluid playground-main-container d-flex flex-column"}>
                    <section className={"row"}>
                        <div className={"col-12 text-center"}>
                            <h1 className="main-title">Playground</h1>
                            Experiment with the Nickel REPL online!
                        </div>
                    </section>
                    <section className={"row playground-container flex-grow-1"}>
                        <div className={"col-6"}>
                            <Editor/>
                        </div>
                        <div className={"col-6"}>
                            <XTerm className={"playground-terminal"}/>
                        </div>
                    </section>
                </div>
        </Layout>
    )
}

export default IndexPage
