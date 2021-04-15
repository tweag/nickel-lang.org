import * as React from 'react';
import { Terminal } from 'xterm';

const nonPrintable = ['Control', 'Alt', '']

export default class XTerm extends React.Component {
    xterm;
    container;
    constructor(props, context) {
        super(props, context);
        this.state = {
            isFocused: false
        };
    }
    componentDidMount() {
        this.xterm = new Terminal(this.props.options);
        this.xterm.open(this.container);
        if (this.props.addons) {
            this.props.addons.forEach(addon => this.xterm.loadAddon(addon));
        }
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
            this.xterm.write('\r\nnickel> ');
        };

        this.xterm.writeln('PLAYGROUND | Online Nickel REPL, powered by xterm.js');
        this.xterm.prompt();
        this.xterm.focus();
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
        this.xterm && this.xterm.write(data);
    }

    writeln(data) {
        this.xterm && this.xterm.writeln(data);
    }

    focus() {
        this.xterm && this.xterm.focus();
    }

    onInput = data => {
        this.props.onInput && this.props.onInput(data);
    };

    onKey = (event) => {
        console.log( `Key: ${event.key} / code: ${event.code}`);
        console.log(event);
        if (event.key === '\r') {
            this.xterm.prompt();
        }
        else if(event.key === '\b' && this.xterm._core.buffer.x > 2) {
            this.xterm.write('\b \b');
        }
        else if (event.key.length === 1) {
            this.xterm.write(event.key);
        }
    };

    onPaste = data => {
        this.write(data)
    };

    resize(cols, rows) {
        this.xterm && this.xterm.resize(Math.round(cols), Math.round(rows));
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
        const terminalClassName = 'ReactXTerm' + (this.state.isFocused ? ' ReactXTerm--focused' : '') + (this.props.className ? ' ' + this.props.className : '');
        return <div ref={ref => (this.container = ref)} className={terminalClassName} />;
    }
}

export { Terminal, XTerm };