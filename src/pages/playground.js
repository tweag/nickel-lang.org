import * as React from "react"
import Layout from "../components/layout"
import {Helmet} from "react-helmet";
import PlaygroundComponent from "../components/playground";
import XTerm from "../components/terminal";
import Editor from "../components/editor";
import { FitAddon } from "xterm-addon-fit/src/FitAddon";

// markup
const PlaygroundPage = () => {
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
                    <PlaygroundComponent/>
                </div>
        </Layout>
    )
}

export default PlaygroundPage
