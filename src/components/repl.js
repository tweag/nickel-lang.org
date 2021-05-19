import * as React from 'react';
import {repl_input, repl_init} from "nickel-repl";
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

const modes = {
    REPL: 'repl',
    JSON: 'json',
    TOML: 'toml',
    YAML: 'yaml',
};

/**
 * An REPL. This component can run Nickel programs or REPL commands and display a stylized output.
 */
export default class Repl extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            lastInput: '',
            /**
             * Lines are what is displayed in REPL mode.
             */
            lines: [
                "Nickel Online REPL | Welcome to the Nickel online REPL.",
                "See the output of your snippets here.",
                "",
            ],
            /**
             * Output is displayed in serialize mode. It is cleared at each new run.
             */
            output: "",
        };
        this.endRef = React.createRef();
    }

    static defaultProps = {
        mode: modes.REPL
    };

    componentDidMount() {
        const result = repl_init();

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
     * Write text. Convert newlines and ANSI escape codes to HTML.
     * In serialize mode, the new data erases the old content. In REPL mode, the new data are appended to the old content.
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
     * Same as write(), but add a new line at the end.
     * @param data String
     */
    writeln(data) {
        this.write(data + "\n");
    }

    /**
     * Write a new line followed by a prompt if in REPL mode.
     */
    prompt = () => {
        if(this.props.mode === modes.REPL) {
            this.write('\n\u001b[32mnickel>\u001b[0m ')
        }
    };

    /**
     * Write an input and run it.
     * @param input String
     */
    onSend = ({detail: input}) => {
        if(this.props.mode === modes.REPL) {
            this.write(input);
        }
        else {
            this.setState({output: ""});
        }

        this.run(input);
    };

    /**
     * Unescape serialized data. To serialize an input, this component wraps the program in a call to `builtins.serialize`.
     * The returned result is a string with escaped characters. This function unescapes them.
     * @param result String
     * @returns String
     */
    unescape = (result) => {
        if(result.charAt(0) === '"' && result.slice(result.length-2, result.length) === '"\n') {
            return result.slice(1, result.length-2).replaceAll('\\"', '"').replaceAll('\\\\', '\\')
        }
        else {
            return result;
        }
    };

    /**
     * Run an input in the Nickel REPL, and write the result.
     * @param input String
     * @returns {number} The return code of the execution of the Nickel REPL, or -1 if the REPL wasn't loaded.
     */
    run = (input) => {
        if (this.repl === null) {
            console.error("Terminal: REPL is not loaded (this.repl === null)");
            return -1;
        }

        this.setState({lastInput: input});

        if(this.props.mode !== modes.REPL) {
            const format = this.props.mode.charAt(0).toUpperCase() + this.props.mode.slice(1);
            input = `builtins.serialize \`${format} (${input})`;
        }

        let result = repl_input(this.repl, input);

        if(this.props.mode === modes.REPL) {
            this.write("\n" + result.msg);
            this.prompt();
        }
        else {
            //If there's an error, we run the original snippet in order to have a better error message.
            if(result.tag === nickelCodes.result.ERROR) {
                const resultAlone = repl_input(this.repl, this.state.lastInput);

                // If there's no error for the original snippet alone, this may be a NonSerializable error. In this case,
                // we keep the first error message.
                if(resultAlone.tag === nickelCodes.result.ERROR) {
                    result = resultAlone;
                }

                this.setState({output: result.msg});
            }
            else {
                this.setState({output: this.unescape(result.msg)});
            }
        }

        // Dispatch the result as an event, so that the editor or other components can react to the outcome of the last input
        const event = new CustomEvent(REPL_RUN_EVENT, {detail: result});
        document.dispatchEvent(event);

        this.forceUpdate();
        return result.tag;
    };

    componentDidUpdate = (prevProps) => {
        // If we switched mode to a serialization mode, we re-run the last input
        if(this.props.mode !== prevProps.mode && this.props.mode !== modes.REPL) {
            this.run(this.state.lastInput);
        }

        // Scroll to the last message
        const terminalContainer = document.getElementById(this.props.containerId);
        terminalContainer.scrollTop = terminalContainer.scrollHeight;
    };

    render() {
        let content;

        if(this.props.mode === modes.REPL) {
            content = this.state.lines.map((line, index) => <div key={index}><Ansi useClasses>{line.toString()}</Ansi><br/></div>);
        }
        else {
            content = <Ansi useClasses>{this.state.output}</Ansi>;
        }

        return <div style={{whiteSpace: 'pre'}}>
            {content}
            <div ref={this.endRef}/>
        </div>
    }
}

export {Repl, REPL_RUN_EVENT, nickelCodes, modes};