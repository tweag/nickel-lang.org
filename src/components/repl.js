import * as React from 'react';
import {wasm_input, wasm_init} from "nickel-repl";
import Ansi from "ansi-to-react";
import {EDITOR_SEND_EVENT} from "./editor";

const REPL_RUN_EVENT = 'nickel-repl:run';

/**
 * Codes returned by the Nickel WASM evaluator.
 * @type {{result: {BLANK: number, SUCCESS: number, PARTIAL: number, ERROR: number}, error: {severity: {HELP: number, BUG: number, NOTE: number, ERROR: number, WARNING: number}, label: {SECONDARY: number, PRIMARY: number}}}}
 */
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

/**
 * An REPL. This component can run Nickel programs or REPL commands and display a stylized output.
 */
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

    /**
     * Write text in the output element. Convert newlines and ANSI escape codes to HTML.
     * @param data String
     */
    write(data) {
        const dataLines = data.split(/\r?\n/g);
        const lines = this.state.lines;
        let lastLine = lines.slice(-1);
        lastLine += dataLines[0];
        const newLines = lines.slice(0, -1).concat([lastLine]).concat(dataLines.slice(1));

        this.setState({lines: newLines});
    }

    /**
     * Write text in the output element, followed by a newline. Convert newlines and ANSI escape codes to HTML.
     * @param data String
     */
    writeln(data) {
        this.write(data + "\n");
    }

    /**
     * Write a new line followed by a prompt `nickel >` in the output element.
     */
    prompt = () => {
        this.write('\n\u001b[32mnickel>\u001b[0m ')
    };

    /**
     * Write an input in the output element, and run it.
     * @param input String
     */
    onSend = ({detail: input}) => {
        this.write(input);
        this.run(input);
    };

    /**
     * Run an input in the Nickel REPL, and print the result in the output element.
     * @param input String
     * @returns {number} The return code of the execution of the Nickel REPL, or -1 if the REPL wasn't loaded.
     */
    run = (input) => {
        if (this.repl === null) {
            console.error("Terminal: REPL is not loaded (this.repl === null)");
            return -1;
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