import * as React from 'react';
import AceEditor from 'react-ace';
import {REPL_RUN_EVENT, nickelCodes} from './repl'

import "ace-builds/src-noconflict/theme-solarized_dark";
import "../ace-nickel-mode/ace-nickel-mode";
import ReactDOMServer from "react-dom/server";

const EDITOR_SEND_EVENT = 'nickel-repl:send';

export default class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: `// Try it out! Type Ctrl+Enter (Cmd+Enter on Mac) to send your code to the repl
let data = {value = "Hello," ++ " world!"} in data.value`,
            placeholder: 'Write your code here and press Ctrl+Enter (Cmd+Enter on Mac) to run it',
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
            showLineNumbers: true,
            annotations: [],
        };
        this.editorRef = React.createRef();
        this.setPlaceholder = this.setPlaceholder.bind(this);
        this.setTheme = this.setTheme.bind(this);
        this.setMode = this.setMode.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setFontSize = this.setFontSize.bind(this);
        this.send = this.send.bind(this);
    }

    componentDidMount() {
        document.addEventListener(REPL_RUN_EVENT, this.onREPLRun.bind(this))
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

    onValidate(_annotations) {
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

    annotationWidget(diagnostic, label) {
        const labelClass = label.style === nickelCodes.error.label.PRIMARY ? 'ansi-red-fg' : 'ansi-blue-fg';
        return (<div>
            <span className={"ansi-bright-red-fg"}>{diagnostic.msg}</span><br/>
            <span className={labelClass}>{label.msg}</span><br/>
            <ul>
                {diagnostic.notes.map(note => <li>{note}</li>)}
            </ul>
        </div>)
    }

    onREPLRun({detail: result}) {
        if (result.tag === nickelCodes.result.ERROR) {
            // In some obscure circumstance (annotation on the last line, and then insertion of a new line), annotations disappear, even if the user send the same input again.
            // To avoid this and make annotations reappear at least when sending an input, we clear the old one first, to triggers reactive updates.
            this.setState({annotations: []});
            const annotations = result.errors.filter(diagnostic => diagnostic.severity >= nickelCodes.error.severity.WARNING)
                .map(diagnostic => (
                    diagnostic.labels.map(label => ({
                        row: label.line_start,
                        column: label.col_start,
                        html: ReactDOMServer.renderToStaticMarkup(this.annotationWidget(diagnostic, label)),
                        type: label.style === nickelCodes.error.label.PRIMARY ? 'error' : 'warning',
                    }))
                )).flat();

            this.setState({annotations});
        } else {
            this.setState({annotations: []});
        }
    }

    setFontSize(e) {
        this.setState({
            fontSize: parseInt(e.target.value, 10)
        });
    }

    send() {
        // Dispatch the result as an event, so that the editor or other components can react to the outcome of the last input
        const event = new CustomEvent(EDITOR_SEND_EVENT, {detail: this.state.value});
        document.dispatchEvent(event);
    }

    render() {
        return <AceEditor
            ref={this.editorRef}
            placeholder={this.state.placeholder}
            mode={this.state.mode}
            theme={this.state.theme}
            name={"nickel-repl-input"}
            height={this.state.height}
            width={this.state.width}
            onChange={this.onChange}
            onSelectionChange={this.onSelectionChange}
            onCursorChange={this.onCursorChange}
            onValidate={this.onValidate}
            value={this.state.value}
            annotations={this.state.annotations}
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
                useWorker: true,
                enableBasicAutocompletion: this.state.enableBasicAutocompletion,
                enableLiveAutocompletion: this.state.enableLiveAutocompletion,
                enableSnippets: this.state.enableSnippets,
                showLineNumbers: this.state.showLineNumbers,
                tabSize: 2
            }}
        />;
    }
}

export {Editor, EDITOR_SEND_EVENT};