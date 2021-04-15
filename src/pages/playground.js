import * as React from "react"
import Layout from "../components/layout"
import {Helmet} from "react-helmet";
import XTerm from "../components/terminal";

// markup
const IndexPage = () => {
    return (
        <Layout>
            <Helmet>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/xterm/2.6.0/xterm.css"/>
            </Helmet>
            <main className="container main-container">
                <h1 className="main-title">Playground</h1>

                <div className="row">
                    <div className="col-12">
                        Experiment with the online Nickel REPL!
                    </div>
                    <div className="col-12 playground">
                        <XTerm />
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default IndexPage
