import * as React from 'react';
import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/theme-solarized_dark";

const initialContent = `// Try it out! Type Ctrl+Enter (or Cmd+Enter) to send your code to the repl
let data = {value = "Hello," ++ " world!"} in data.value`;

export default class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: initialContent,
            placeholder: "Placeholder Text",
            theme: "solarized_dark",
            mode: "nickel",
            height: "100%",
            width: "100%",
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            fontSize: 14,
            showGutter: true,
            showPrintMargin: true,
            highlightActiveLine: true,
            enableSnippets: false,
            showLineNumbers: true
        };
        this.setPlaceholder = this.setPlaceholder.bind(this);
        this.setTheme = this.setTheme.bind(this);
        this.setMode = this.setMode.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setFontSize = this.setFontSize.bind(this);
        this.setBoolean = this.setBoolean.bind(this);
        this.send = this.send.bind(this);
    }

    componentDidMount() {
        require("../ace-nickel-mode/ace-nickel-mode");
    }

    onChange(newValue) {
        this.setState({
            value: newValue
        });
    }

    onSelectionChange(newValue, event) {
    }

    onCursorChange(newValue, event) {
    }

    onValidate(annotations) {
    }

    setPlaceholder(e) {
        this.setState({
            placeholder: e.target.value
        });
    }

    setTheme(e) {
        this.setState({
            theme: e.target.value
        });
    }

    setMode(e) {
        this.setState({
            mode: e.target.value
        });
    }

    setBoolean(name, value) {
        this.setState({
            [name]: value
        });
    }

    setFontSize(e) {
        this.setState({
            fontSize: parseInt(e.target.value, 10)
        });
    }

    setSize(height, width) {
        this.setState({
            height,
            width,
        })
    }

    send() {
        if(this.props.onSend) {
            this.props.onSend(this.state.value)
        }
    }

    render() {
        return <AceEditor
            placeholder={this.state.placeholder}
            mode={this.state.mode}
            theme={this.state.theme}
            name="nickel-repl-input"
            height={this.state.height}
            width={this.state.width}
            onChange={this.onChange}
            onSelectionChange={this.onSelectionChange}
            onCursorChange={this.onCursorChange}
            onValidate={this.onValidate}
            value={this.state.value}
            fontSize={this.state.fontSize}
            showPrintMargin={this.state.showPrintMargin}
            showGutter={this.state.showGutter}
            highlightActiveLine={this.state.highlightActiveLine}
            commands={[
                {
                    name: 'send-repl',
                    bindKey: {
                        win: 'Ctrl-enter',
                        mac: 'Cmd-enter',
                    },
                    exec: this.send,
                },
            ]}
            setOptions={{
                useWorker: false,
                enableBasicAutocompletion: this.state.enableBasicAutocompletion,
                enableLiveAutocompletion: this.state.enableLiveAutocompletion,
                enableSnippets: this.state.enableSnippets,
                showLineNumbers: this.state.showLineNumbers,
                tabSize: 2
            }}
        />;
    }
}