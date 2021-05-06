import * as React from 'react';
import { Terminal } from 'xterm';
import {FitAddon} from "xterm-addon-fit";
import {wasm_input, wasm_init} from "nickel-repl";

const NICKEL_SUCCESS = 0;
const NICKEL_BLANK = 1;
const NICKEL_PARTIAL = 2;
const NICKEL_ERROR = 3;

export default class XTerm extends React.Component {
    xterm;
    container;
    constructor(props, context) {
        super(props, context);
        this.state = {
            isFocused: false
        };
        this.state = {lines: "Hello, welcome to NICKEL \n"};
    }
    componentDidMount() {
        this.xterm = new Terminal(this.props.options);
        //this.xterm.open(this.container);

        this.fitAddon = new FitAddon();
        this.xterm.loadAddon(this.fitAddon);

        if (this.props.onContextMenu) {
            this.xterm.element.addEventListener('contextmenu', this.onContextMenu.bind(this));
        }
        if (this.props.onInput) {
            this.xterm.onData(this.onInput);
        }
        if (this.props.value) {
            this.xterm.write(this.props.value);
        }

        this.xterm.onKey(this.onKey);

        this.xterm.prompt = () => {
            this.writeAnsi('\r\n\u001b[32mnickel>\u001b[0m ')
            //this.xterm.write('\r\n\u001b[32mnickel>\u001b[0m ');
            this.input = '';
        };

        this.xterm.writeln('PLAYGROUND | Online Nickel REPL, powered by xterm.js');
        this.xterm.focus();
        this.fitAddon.fit();

        const result = wasm_init();
        if(result.tag === NICKEL_ERROR) {
            this.xterm.writeln(`Initialization error: ${result.msg}`);
        }
        else {
            // WARNING: result is moved by the Rust code when calling to the repl() method. Do not use or copy result after this line
            this.repl = result.repl();
            this.xterm.prompt();
        }
    }

    componentWillUnmount() {
        // is there a lighter-weight way to remove the cm instance?
        if (this.xterm) {
            this.xterm.dispose();
            this.xterm = null;
        }
    }

    shouldComponentUpdate(nextProps, nextState, _nextContext) {
        if (nextProps.hasOwnProperty('value') && nextProps.value != this.props.value) {
            if (this.xterm) {
                this.xterm.clear();
                setTimeout(()=>{
                    this.xterm.write(nextProps.value);
                },0)
            }
        }
        return false;
    }

    getTerminal() {
        return this.xterm;
    }

    write(data) {
        //this.xterm && this.xterm.write(data);
        this.setState({input: this.state.input + data.replaceAll(/\r?\n/g, "<br>")});
    }

    writeln(data) {
        //this.xterm && this.xterm.writeln(data);
        this.setState({input: this.state.input + "<br>" + data.replaceAll(/\r?\n/g, "<br>")});
    }

    writeAnsi(data) {
        this.write(data)
    }

    focus() {
        this.xterm && this.xterm.focus();
    }

    onInput = data => {
        this.props.onInput && this.props.onInput(data);
    };

    onKey = (event) => {
        if (this.repl === null) {
            return;
        }

        if (event.key === '\r') {
            this.run(true);
        }
        else if((event.key === '\b' || event.key === '\u007f') && this.input.length > 0) {
            this.input = this.input.slice(0, -1);
            this.xterm.write('\b \b');
        }
        else if (event.key.length === 1) {
            this.input += event.key;
            this.xterm.write(event.key);
        }
    };

    send = (input) => {
        this.write(input);
        this.input = input;
        console.log('Send to text area input ' + input);
        this.run(false);
        console.log('Global input: ' + this.state.input);
    };

    run = (allowPartial) => {
        if(this.repl === null) {
            console.error("Terminal: REPL is not loaded (this.repl === null)");
            return;
        }

        const result = wasm_input(this.repl, this.input);

        if(result.tag === NICKEL_PARTIAL && allowPartial) {
            this.xterm.writeln('');
            this.input += '\n';
        }
        else if(result.tag === NICKEL_PARTIAL && !allowPartial) {
            this.xterm.writeln('');
            this.xterm.write('Error: unexpected end of input');
            this.xterm.prompt();
        }
        else {
            this.xterm.writeln('');
            this.xterm.write(result.msg.replace(/\r?\n/g, "\r\n"));
            this.xterm.prompt();
        }

        this.forceUpdate();
        return result.tag;
    };

    onPaste = data => {
        this.write(data)
    };

    resize(cols, rows) {
        this.xterm && this.xterm.resize(Math.round(cols), Math.round(rows));
        this.fitAddon && this.fitAddon.fit();
    }

    setOption(key, value) {
        this.xterm && this.xterm.setOption(key, value);
    }

    refresh() {
        this.xterm && this.xterm.refresh(0, this.xterm.rows - 1);
    }

    onContextMenu(e) {
        this.props.onContextMenu && this.props.onContextMenu(e);
    }

    render() {
        return <>
            <p>{this.state.input}</p>
        </>
        //return <textarea value={this.state.input} readOnly/>
        //return <div ref={ref => (this.container = ref)} className={this.props.className}/>;
    }
}

export { Terminal, XTerm };