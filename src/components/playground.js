import * as React from 'react';

import Editor from "./editor";
import {Repl, modes} from "./repl";

/**
 * Playground component, composed of both a code editor and a REPL component.
 */
export default class Playground extends React.Component {
    constructor(props) {
        super(props);
        this.state = {mode: modes.REPL};
        this.setMode = this.setMode.bind(this);
    }

    replTabStyle = (mode) => ('nav-link' + (this.state.mode === mode ? ' active' : ''));

    setMode = (mode) => {
        this.setState({mode});
    };

    render() {
        return <section className={"row playground-container flex-grow-1"}>
                <div class={"col-12"}>
                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <a className={this.replTabStyle(modes.REPL)} onClick={() => this.setMode(modes.REPL)}>REPL</a>
                        </li>
                        <li className="nav-item">
                            <a className={this.replTabStyle(modes.JSON)} onClick={() => this.setMode(modes.JSON)}>JSON</a>
                        </li>
                        <li className="nav-item">
                            <a className={this.replTabStyle(modes.YAML)} onClick={() => this.setMode(modes.YAML)}>YAML</a>
                        </li>
                        <li className="nav-item">
                            <a className={this.replTabStyle(modes.TOML)} onClick={() => this.setMode(modes.TOML)}>TOML</a>
                        </li>
                    </ul>
                </div>
                <div className={"col-6"}>
                    <Editor/>
                </div>
                <div id={"playground-terminal-container"} className={"col-6 ansi-monokai playground-terminal-container"}>
                    <Repl containerId={"playground-terminal-container"} className={"playground-terminal"} mode={this.state.mode}/>
                </div>
            </section>
    }
}