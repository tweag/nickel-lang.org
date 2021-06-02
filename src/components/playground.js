import * as React from 'react';

import Editor from "./editor";
import {modes, Repl} from "./repl";
import {Command} from 'react-bootstrap-icons';

const PLAYGROUND_SEND_EVENT = 'playground:send';

/**
 * Playground component, composed of both a code editor and a REPL component.
 */
export default class Playground extends React.Component {
    constructor(props) {
        super(props);
        this.state = {mode: modes.REPL};
        this.setMode = this.setMode.bind(this);
        this.dispatchSendEvent = this.dispatchSendEvent.bind(this);
    }

    replTabStyle = (mode) => ('nav-link' + (this.state.mode === mode ? ' active' : ''));

    setMode = (mode) => {
        this.setState({mode});
    };

    dispatchSendEvent = () => {
        const event = new CustomEvent(PLAYGROUND_SEND_EVENT);
        document.dispatchEvent(event);
    };

    render() {
        return <React.Fragment>
            <div className={"row"}>
                <div className={"col-6 playground-tab d-flex align-items-center"}>
                    <div>
                        <button className={"btn btn-primary"} onClick={() => this.dispatchSendEvent()}>Run</button>
                        <kbd className={"ml-4"}>Ctrl</kbd>+<kbd>Enter</kbd> (or <kbd>Cmd <Command/>
                    </kbd>+<kbd>Enter</kbd>)
                    </div>
                </div>
                <ul className={"nav nav-pills playground-tab col-6"}>
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

            <section className={"row playground-container flex-grow-1"}>
                <div className={"col-6"}>
                    <Editor/>
                </div>
                <div id={"playground-terminal-container"}
                     className={"col-6 ansi-monokai playground-terminal-container"}>
                    <Repl containerId={"playground-terminal-container"} className={"playground-terminal"}
                          mode={this.state.mode}/>
                </div>
            </section>
        </React.Fragment>
    }
}

export {Playground, PLAYGROUND_SEND_EVENT}