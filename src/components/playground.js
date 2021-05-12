import * as React from 'react';

import Editor from "./editor";
import Repl from "./repl";

export default class Playground extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <section className={"row playground-container flex-grow-1"}>
            <div className={"col-6"}>
                <Editor/>
            </div>
            <div id={"playground-terminal-container"} className={"col-6 ansi-monokai playground-terminal-container"}>
                <Repl containerId={"playground-terminal-container"} className={"playground-terminal"}/>
            </div>
        </section>
    }
}