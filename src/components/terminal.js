import * as React from 'react';
import {wasm_input, wasm_init} from "nickel-repl";
import Ansi from "ansi-to-react";

const NICKEL_SUCCESS = 0;
const NICKEL_BLANK = 1;
const NICKEL_PARTIAL = 2;
const NICKEL_ERROR = 3;

export default class XTerm extends React.Component {
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
        if (result.tag === NICKEL_ERROR) {
            this.writeln(`Initialization error: ${result.msg}`);
        } else {
            // /!\ WARNING: result is moved by the Rust code when calling to the repl() method. Do not use or copy result after this line.
            this.repl = result.repl();
            this.prompt();
        }
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

    send = (input) => {
        this.write(input);
        console.log('Send to text area input ' + input);
        this.run(input);
        console.log('Global input: ' + this.state.lines);
    };

    run = (input) => {
        if (this.repl === null) {
            console.error("Terminal: REPL is not loaded (this.repl === null)");
            return;
        }

        const result = wasm_input(this.repl, input);
        console.log('RUN - ');
        console.log(result.msg);
        this.write("\n" + result.msg);
        this.prompt();
        this.forceUpdate();

        return result.tag;
    };

    componentDidUpdate = () => {
        // Scroll to the last message
        this.endRef.current.scrollIntoView()
    };

    render() {
        console.log(this.state.lines);
        const items = this.state.lines.map((line, index) =>
            <div key={index}><Ansi useClasses>{line.toString()}</Ansi><br/></div>);
        return <div style={{'white-space': 'pre'}}>
            {items}
            <div ref={this.endRef}/>
        </div>
    }
}

export {XTerm};