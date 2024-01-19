import * as React from "react"
import {useEffect} from "react"
import Layout from "../components/layout"

import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-yaml";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/plugins/command-line/prism-command-line";
import "prismjs/plugins/command-line/prism-command-line.css";
import Playground from "../components/playground-clientside";
import modes from "../components/playground/modes";
import nickelLanguageDefinition from "../prism/nickel";

// Escaping curly braces and other stuff in JSX is tiring, so we define all code examples here
const codeExamples = {
    withNix: {
        nix_run: `nix run --experimental-features "flakes nix-command" github:tweag/nickel/stable -- repl
nickel>`,
        install: `nix profile install github:tweag/nickel/stable
nickel repl
nickel>`,
    },
    withCargo: {
        install: `cargo install nickel-lang-cli
nickel repl
nickel>`,
    },
    withHomeBrew: {
        install: `brew install nickel
nickel repl
nickel>`,
    },
    withDocker: {
        install: `docker run --rm -it ghcr.io/tweag/nickel:1.4.0 repl
nickel>`,
    },
    firstConfig: `{
  name = "example",
  description = m%"
    This is an awesome software I'm developing.
    Please use it!
  "%,
  version = "0.1.1",
  main = "index.js",
  keywords = ["example", "config"],
  scripts = {
    test = m%"
      test.sh --option --install example --version "0.1.1"
    "%,
    do_stuff = "do_stuff.sh subcommand",
  },
  contributors = [{
      name = "John Doe",
      email = "johndoe@example.com"
    }, {
      name = "Ivy Lane",
      url = "https://example.com/ivylane"
    }],
  dependencies = {
    dep1 = "^1.0.0",
    dep3 = "6.7"
  }
}`,
    export: `nickel export example.ncl --format yaml
---
contributors:
  - email: johndoe@example.com
    name: John Doe
  - name: Ivy Lane
    url: https://example.com/ivylane
dependencies:
  dep1: ^1.0.0
  dep3: "6.7"
description: "This is awesome software I'm developing.\\nPlease use it!"
keywords:
  - example
  - config
main: index.js
name: example
scripts:
  do_stuff: do_stuff.sh subcommand
  test: "test.sh --option --install example --version \\"0.1.1\\""
version: 0.1.1`,
    "importingYaml": `{
  # [...]
  scripts = {
    test = m%"
      test.sh --option --install example --version "0.1.1"
    "%,
    do_stuff = "do_stuff.sh subcommand",
  },
  contributors = import "contributors.yaml",
  # [...]
}`,
    reuse: {
        problem: `name = "example",
version = "0.1.1",
scripts = {
  test = m%"
    test.sh --option --install example --version "0.1.1"
  "%,`,
        diff: `name = "example",
version = "0.1.1",
scripts = {
  test = m%"
    test.sh --option --install %{name} --version "%{version}"
  "%,`,
        result: `# [...]
scripts:
  do_stuff: do_stuff.sh subcommand
  test: "test.sh --option --install example --version \\"0.1.2\\""
version: 0.1.2`,
    },
};

const IndexPage = () => {
    useEffect(() => {
        Prism.languages.nickel = nickelLanguageDefinition;
        Prism.highlightAll();
    }, []);

    return (
        <Layout>
            <main className="container content-main-container content documentation-page">
                <h1 id="getting-started" className={'main-title'}>Getting started</h1>

                <p>Nickel is still young, and the installation process is not yet optimal. Sorry about that! We are focused on improving the
                    experience, so stay tuned. </p>

                We give three alternative ways of obtaining a running Nickel executable:
                <ol>
                    <li>Using <a className={"link-primary"} href="https://nixos.org/">Nix</a></li>
                    <li>Using <a className={"link-primary"} href="https://doc.rust-lang.org/cargo/">Cargo</a></li>
                    <li>Using <a className={"link-primary"} href="https://www.docker.com/">Docker</a></li>
                </ol>

                If you have neither of these tools, Nix is the preferred way. If you don't have Nix but you are a user of Cargo or Docker, you may prefer the corresponding installation method.

                <h2 id="build-using-nix">Get a Nickel binary using Nix</h2>

                <h3>Run</h3>

                <p>With a recent version of Nix ({'>'} 2.4.0), you can build and run Nickel in one shot. If you haven't installed Nix yet, please follow
                    <a className={"link-primary"} href={"https://nixos.org/guides/nix-pills/install-on-your-running-system.html"}> this installation guide</a>. Once Nix is installed, use <code>nix run</code> to start Nickel
                    and append <code>-- args</code> to pass arguments to the Nickel executable (here we launch an REPL session)</p>

                <pre className={'command-line language-bash'} data-user="devops" data-host="nickel"
                     data-output="2:"><code>{codeExamples.withNix.nix_run}</code></pre>

                <h3>Install</h3>

                <p>If you are planning to try Nickel a bit more extensively, you can install the Nickel binary using <code>nix profile</code>:</p>

                <pre className={'command-line language-bash'} data-user="devops" data-host="nickel" data-output={"3"}>
                    <code>{codeExamples.withNix.install}</code>
                </pre>

                <h2 id="build-using-cargo">Get a Nickel binary using Cargo</h2>

                <p>If you are a Rust developer, the <a className={"link-primary"} href="https://doc.rust-lang.org/cargo/">Cargo</a> build tool is an alternative way to install a Nickel binary:</p>
                <pre className={'command-line language-bash'} data-user="devops" data-host="nickel"
                     data-output="3"><code>{codeExamples.withCargo.install}</code></pre>

                <h2 id="install-with-homebrew">Install with Homebrew</h2>

                <p>If you're running macOS you can use Homebrew to install the Nickel binary.</p>
                <pre className={'command-line language-bash'} data-user="devops" data-host="nickel" data-output={"3"}>
                    <code>{codeExamples.withHomeBrew.install}</code>
                </pre>

                <h2 id="build-using-docker">Get a Docker image</h2>

                <p>A last alternative is to use <a className={"link-primary"} href="https://www.docker.com/">Docker</a> image:</p>
                <pre className={'command-line language-bash'} data-user="devops" data-host="nickel" data-output={"2:"}>
                    <code>{codeExamples.withDocker.install}</code>
                </pre>

                <h2 id="write-your-first-configuration">Write your first configuration</h2>

                <p> Nickel has advanced features to help you handle and organize complex configurations (gradual typing, contracts, a merge system, and so on).
                    But you'll only have to deal with any of this once you need to.
                    Writing a basic configuration is as simple as writing JSON or YAML. Let's write a manifest of a fictional app:</p>

                <div className={'d-none d-md-block'}>
                    <Playground fit={'code'} mode={modes.YAML} value={codeExamples.firstConfig}/>
                </div>
                <div className={'d-block d-md-none'}>
                    <pre><code className={'language-nickel'}>{codeExamples.firstConfig}</code></pre>
                </div>
                <p/>This program is composed of a <i>record</i>. A record is the same thing as an object in JSON, that is a list of
                    key-value pairs delimited
                    by <code>{'{'}</code> and <code>{'}'}</code>. In general, Nickel values map directly to
                    values in JSON, excluding functions. Thus, the basic datatypes of Nickel are the same as in JSON:
                    <ul>
                        <li>Records (objects), delimited by <code>{'{'}</code> and <code>{'}'}</code>.</li>
                        <li>Strings, delimited by <code>&quot;</code>. The sequences <code>m%&quot;</code> and <code>&quot;%</code> delimit multiline strings.
                        </li>
                        <li>Numbers.</li>
                        <li>Arrays, delimited by <code>[</code> and <code>]</code> and separated by <code>,</code>.</li>
                    </ul>

                <p/>Multiline strings are an alternative way of writing string literals. Line 11 is an example of such a string. Without diving into the details, multiline strings are
                    useful for:
                    <ul>
                        <li>Writing strings spanning several lines, as their name suggests. Multiline strings can be indented at the same
                            level as the surrounding code while still producing the expected result: the common indentation prefix is stripped.
                        </li>
                        <li>Writing strings with special characters without having to escape them.</li>
                    </ul>

                In our example, using a multiline string saves us from escaping the recurring double quotes <code>"</code>.
                <h2 id="export">Export & Import</h2>
                <p>The ultimate goal of a Nickel program is to produce a static configuration. To do so, save the example above to <code>example.ncl</code> and run <code>nickel export</code>:</p>
                <pre className={'command-line language-bash'} data-user="devops" data-host="nickel:~/nickel"
                     data-output="2-21:"><code>{codeExamples.export}</code></pre>

                <p>Nickel currently supports exporting to and importing from YAML, TOML and JSON. Importing an existing configuration into a Nickel one
                    is as easy as writing <code className={'language-nickel'}>import "something.yaml"</code>. For example, if our contributor data is already stored in a YAML
                    file <code>contributors.yaml</code> and we want to gradually migrate the manifest to Nickel, we could import <code>contributors.yaml</code> as a first step:</p>
                    <pre><code className={'language-nickel'}>{codeExamples.importingYaml}</code></pre>

                <h2 id="reuse">Reuse</h2>

                <p>Nickel is a programming language. This allows you to not only describe, but
                    generate data. There&#39;s repetition in our previous example:</p>
                <pre><code className={'language-nickel'}>{codeExamples.reuse.problem}</code></pre>

                <p>The version <code>0.1.1</code> appears both in <code>version</code> and <code>scripts.test</code>.
                    The name <code>example</code> appears both in <code>name</code> and <code>scripts.test</code> as well.
                    Pure aesthetics aside, a more serious issue is inconsistency. If you bump the
                    version number in <code>version</code>, you may forget to do so in the <code>scripts.test</code> as well,
                    ending up with incoherent version numbers in the same configuration. To remedy the problem, let's have a
                    single source of truth by reusing the value of <code>name</code> and <code>version</code> in <code>scripts.test</code>, using
                    the string interpolation syntax <code>%{'{expr}'}</code>:</p>
                <pre><code className={'diff'}>{codeExamples.reuse.diff}</code></pre>

                <p>Now, if we change version to <code>0.1.2</code> and export the result, the test script
                    invocation is updated as well:</p>

                <pre><code className={'language-yaml'}>{codeExamples.reuse.result}</code></pre>

                <h2 id="going-further">Going further</h2>

                <p>This short introduction should get you started. Nickel is a
                    full-fledged programming language, featuring higher-order functions, gradual
                    typing, contracts, and more! To explore further, read the <a
                        className={"link-primary"}
                        href="/user-manual/introduction">user manual</a>
                    . In particular, the <a
                        className={"link-primary"}
                        href="/user-manual/tutorial">last section</a> is
                    a slighty more advanced tutorial.
                    You will also find <a
                        className={"link-primary"}
                        href="https://github.com/tweag/nickel/tree/master/examples">examples in the repository</a>. For an overview of Nickel and the motivations behind it, see the <a
                        className={"link-primary"}
                        href="https://github.com/tweag/nickel/#nickel">README</a> and the <a
                className={"link-primary"}
                href="https://github.com/tweag/nickel/blob/master/RATIONALE.md">design rationale document</a>.</p>
            </main>
        </Layout>
    );
};

export default IndexPage
