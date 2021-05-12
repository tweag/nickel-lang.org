import * as React from 'react';

import Editor from "./editor";
import XTerm from "./terminal";

export default class Playground extends React.Component {
    constructor(props) {
        super(props);
        this.terminal = React.createRef();
    }

    onSend(input) {
        this.terminal.current.send(input.replaceAll(/\r?\n/g, "\r\n"));
    };

    render() {
        return <section className={"row playground-container flex-grow-1"}>
            <div className={"col-6"}>
                <Editor onSend={this.onSend.bind(this)}/>
            </div>
            <div id={"playground-terminal-container"} className={"col-6 ansi-monokai playground-terminal-container"}>
                <XTerm ref={this.terminal} containerId={"playground-terminal-container"} className={"playground-terminal"}/>
            </div>
        </section>
    }
}