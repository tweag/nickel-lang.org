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
        clone: `git clone git@github.com:tweag/nickel.git
Cloning in 'nickel'...
[..]
cd nickel`,
        build: `nix-build
[1 built, 0.0 MiB DL]`,
        run: `./result/bin/nickel -V
nickel 0.1.0`,
    },
    firstConfig: `let Version
    | doc "Contract: check if version is correctly formatted"
    = contracts.from_predicate (fun version =>
        strings.is_match "^\\^?\\d+(\\.[0-9a-z]+)*$" version) in

let Contributor
    | doc "Contract: contributor is a record who have at least a name"
    = fun label contributor =>
        let is_name = fun name
                => lists.all
                    (strings.is_match "^[A-Z][a-z]*$")
                    (strings.split " " name) in
        if records.has_field "name" contributor && is_name contributor.name then
                contributor
            else
                contracts.blame label in

let Command
    | doc "Contract: a command starts with a shell executable and may have arguments"
    = fun label command =>
        let extract_command = fun com => lists.head (strings.split " " com) in
        let is_shell_exe = strings.is_match "\\.sh$" in
        let extracted = extract_command command in
        if command != "" && is_shell_exe extracted then
            command
        else
            contracts.blame_with (extracted ++ " should be a shell command") label in

let Scripts
    = fun test =>
        let init_contract = { do_stuff | #Command, .. } in
        let test_contract = if test then { } else { test | #Command } in
        init_contract & test_contract in

let Configuration
    | doc m#"
      Contract: a configuration contains the correct requirements
      for name, description, version, main, keywords, scripts,
      contributors and dependencies.
      "#m
    = {
        name | #strings.NonEmpty,
        description | Str,
        version | #Version,
        main | #strings.NonEmpty
             | doc "location of main file"
             | default = "main.js",
        has_tests | Bool
                  | doc "indicate if should be tested"
                  | default = true,
        keywords | List Str,
        scripts | #(Scripts has_tests)
                | doc m#"
                    List of commands.
                    Contains at least a *do_stuff* key which is an executable.
                    If *test* is set, should also contains a *test* key.
                    May have other keys.
                    "#m,
        contributors | List #Contributor,
        dependencies | {_ : #Version},
        ..
    } in

{
  name = strings.lowercase "Example",
  description = m#"
    This is an awesome software I'm developing.
    Please use it!
  "#m,
  version = "0.1.1",
  main = "index.js",
  keywords = ["example", "config"],
  scripts = {
    test = m#"test.sh --option --install example --version "0.1.1""#m,
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
} | #Configuration`,
    export: `./result/bin/nickel -f example.ncl export --format yaml
---
contributors:
  - email: johndoe@example.com
    name: John Doe
  - name: Ivy Lane
    url: "https://example.com/ivylane"
dependencies:
  dep1: ^1.0.0
  dep3: "6.7"
description: "This is an awesome software I'm developing.\\nPlease use it!"
has_tests: true
keywords:
  - example
  - config
main: index.js
name: example
scripts:
  do_stuff: do_stuff.sh subcommand
  test: "test.sh --option --install example --version \\"0.1.1\\""
version: 0.1.1`,
    reuse: {
        problem: `name = "example",
version = "0.1.1",
scripts = {
  test = m#"test.sh --option --install example --version "0.1.1""#m,`,
        diff: `name = "example",
version = "0.1.1",
scripts = {
  test = m#"test.sh --option --install #{name} --version "#{version}""#m`,
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
            <main className="container content-main-container content">
                <h1 id="getting-started" className={'main-title'}>Getting started</h1>

                <p>Nickel is still young and the installation process is not yet optimal. Sorry about that! We are focused on improving the
                    experience, so stay tuned. </p>

                <h2 id="build-from-source-using-nix">Build from source using Nix</h2>

                <p>Using <a className={"link-primary"} href="https://nixos.org/">Nix</a> is the easiest way
                    to get a Nickel executable
                    running.</p>

                <ol>
                    <li><p>Clone the <a className={"link-primary"} href="https://github.com/tweag/nickel">Nickel
                        repository</a> and set it as the current directory:</p>

                        <pre className={'command-line language-bash'} data-user="devops" data-host="nickel"
                             data-output="2-3:"><code>{codeExamples.withNix.clone}</code></pre>
                    </li>
                    <li><p>Invoke <code>nix-build</code>:</p>
                        <pre className={'command-line language-bash'} data-user="devops" data-host="nickel:~/nickel"
                             data-output="2:"><code>{codeExamples.withNix.build}</code></pre>
                    </li>
                    <li><p>If everything went right, a binary is now available in the <code>result</code> directory:</p>
                        <pre className={'command-line language-bash'} data-user="devops" data-host="nickel:~/nickel"
                             data-output="2:"><code>{codeExamples.withNix.run}</code></pre>
                    </li>
                </ol>

                <h2 id="build-from-source-without-nix">Build from source without Nix</h2>

                <p>Please refer to the <a
                    className={"link-primary"}
                    href="https://github.com/tweag/nickel/#getting-started">README</a> of the <a
                    className={"link-primary"}
                    href="https://github.com/tweag/nickel">Nickel repository</a> for alternative ways of building Nickel.</p>

                <h2 id="write-your-first-configuration">Write your first configuration</h2>

                <p> Nickel has advanced features to help you handle and organize complex configurations (gradual typing, contracts, a merge system, and so on).
                    But you'll only have to deal with any of this once you need to.
                    Writing a basic configuration is as simple as writing JSON or YAML. Let us write a manifest of a fictional app:</p>

                <div className={'d-none d-md-block'}>
                    <Playground fit={'code'} mode={modes.YAML} value={codeExamples.firstConfig}/>
                </div>
                <div className={'d-block d-md-none'}>
                    <pre><code className={'language-nickel'}>{codeExamples.firstConfig}</code></pre>
                </div>
                <p/>This program is composed of <i>record</i>. A record is the same thing as an object in JSON. It is a list of
                    key-value pairs delimited
                    by <code>{'{'}</code> and <code>{'}'}</code>. In general, the values of Nickel map directly to
                    corresponding values in JSON (excluding functions). Thus, the basic datatypes of Nickel are the same as in JSON:
                    <ul>
                        <li>Records (objects), delimited by <code>{'{'}</code> and <code>{'}'}</code>.</li>
                        <li>Strings, delimited by <code>&quot;</code>. The sequence <code>m#&quot;</code> and <code>&quot;#m</code> delimits multiline strings.
                        </li>
                        <li>Numbers</li>
                        <li>Lists, delimited by <code>[</code> and <code>]</code> and separated by <code>,</code>.</li>
                    </ul>

                <p/>Multiline strings are an alternative way of defining strings. Line 11 is an example of such a string. Without diving into the details, multiline strings are
                    useful for:
                    <ul>
                        <li>Write strings spanning several lines, as their name suggests. Multiline strings can be indented at the same
                            level as the surrounding code while still producing the expected result (the common indentation prefix is stripped).
                        </li>
                        <li>Write strings with special characters without having to escape them.</li>
                    </ul>

                In our example, using a multiline string saves us from escaping the recurring double quotes <code>"</code>.
                <h2 id="export">Export</h2>
                <p>The ultimate goal of a Nickel program is to produce a static configuration. To do so, save the content of our example above in <code>example.ncl</code> and run <code>nickel export</code>:</p>
                <pre className={'command-line language-bash'} data-user="devops" data-host="nickel:~/nickel"
                     data-output="2-21:"><code>{codeExamples.export}</code></pre>

                <p>Nickel currently supports exporting to and importing from YAML, TOML and JSON.</p>

                <h2 id="reuse">Reuse</h2>

                <p>Nickel is a programming language. This allows you not only to describe, but to
                    generate data. There&#39;s repetition in our previous example:</p>
                <pre><code className={'language-nickel'}>{codeExamples.reuse.problem}</code></pre>

                <p>The version <code>0.1.1</code> appears both in <code>version</code> and <code>scripts.test</code>.
                    The name <code>example</code> appears both in <code>name</code> and <code>scripts.test</code> as well.
                    Pure aesthetics aside, a more serious issue is inconsistency. If you bump the
                    version number in <code>version</code>, you may forget to do so in the <code>scripts.test</code> as well,
                    ending up wih incoherent version numbers in the same configuration. To remedy the problem, let's have a
                    single source of truth by reusing the value of <code>name</code> and <code>version</code> in <code>scripts.test</code>, using
                    the string interpolation syntax <code>#{'{expr}'}</code>:</p>
                <pre><code className={'language-nickel'}>{codeExamples.reuse.diff}</code></pre>

                <p>Now, if we change version to <code>0.1.2</code> and export the result, the test script
                    invocation is updated as well:</p>

                <pre><code className={'language-yaml'}>{codeExamples.reuse.result}</code></pre>

                <h2 id="going-further">Going further</h2>

                <p>This short introduction should get you started. Nickel is a
                    full-fledged programming language, featuring higher-order functions, gradual
                    typing, contracts, and more! Additional resources are to come on this website. In the meantime, you can find <a
                        className={"link-primary"}
                        href="https://github.com/tweag/nickel/tree/master/examples">examples in the repository</a>. You will also find more details on the language and its design in the <a
                        className={"link-primary"}
                        href="https://github.com/tweag/nickel/#nickel">README</a> and in the <a
                className={"link-primary"}
                href="https://github.com/tweag/nickel/blob/master/RATIONALE.md">design rationale</a>.</p>
            </main>
        </Layout>
    );
};

export default IndexPage
