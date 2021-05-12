import * as React from 'react';
import {wasm_input, wasm_init} from "nickel-repl";
import Ansi from "ansi-to-react";
import {EDITOR_SEND_EVENT} from "./editor";

const REPL_RUN_EVENT = 'nickel-repl:run';

const nickelCodes = {
    result: {
        SUCCESS: 0,
        BLANK: 1,
        PARTIAL: 2,
        ERROR: 3,
    },
    error: {
        severity: {
            HELP: 1,
            NOTE: 2,
            WARNING: 3,
            ERROR: 4,
            BUG: 5,
        },
        label: {
            PRIMARY: 0,
            SECONDARY: 1,
        }
    }
};

export default class Repl extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            lines: [
                "Nickel Online REPL | Welcome to the Nickel online REPL.",
                "See the output of your snippets here.",
                "",
            ],
        };
        this.endRef = React.createRef();
    }

    componentDidMount() {
        const result = wasm_init();
        if (result.tag === nickelCodes.result.ERROR) {
            this.writeln(`Initialization error: ${result.msg}`);
        } else {
            // /!\ WARNING: result is moved by the Rust code when calling to the repl() method. Do not use or copy result after this line.
            this.repl = result.repl();
            this.prompt();
        }
        document.addEventListener(EDITOR_SEND_EVENT, this.onSend.bind(this))
    }

    write(data) {
        const dataLines = data.split(/\r?\n/g);
        const lines = this.state.lines;
        let lastLine = lines.slice(-1);
        lastLine += dataLines[0];
        const newLines = lines.slice(0, -1).concat([lastLine]).concat(dataLines.slice(1));

        this.setState({lines: newLines});
    }

    writeln(data) {
        this.write(data + "\n");
    }

    writeAnsi(data) {
        this.write(data)
    }

    prompt = () => {
        this.writeAnsi('\n\u001b[32mnickel>\u001b[0m ')
    };

    onSend = ({detail: input}) => {
        this.write(input);
        this.run(input);
    };

    run = (input) => {
        if (this.repl === null) {
            console.error("Terminal: REPL is not loaded (this.repl === null)");
            return;
        }

        const result = wasm_input(this.repl, input);

        // Dispatch the result as an event, so that the editor or other components can react to the outcome of the last input
        const event = new CustomEvent(REPL_RUN_EVENT, {detail: result});
        document.dispatchEvent(event);

        this.write("\n" + result.msg);
        this.prompt();
        this.forceUpdate();

        return result.tag;
    };

    componentDidUpdate = () => {
        // Scroll to the last message
        const terminalContainer = document.getElementById(this.props.containerId);
        //this.endRef.current.scrollIntoView()
        terminalContainer.scrollTop = terminalContainer.scrollHeight;
    };

    render() {
        const items = this.state.lines.map((line, index) =>
            <div key={index}><Ansi useClasses>{line.toString()}</Ansi><br/></div>);
        return <div style={{whiteSpace: 'pre'}}>
            {items}
            <div ref={this.endRef}/>
        </div>
    }
}

export {Repl, REPL_RUN_EVENT, nickelCodes};