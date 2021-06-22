import * as React from "react"
import Layout from "../components/layout"

import "prismjs";
import "prismjs/components/prism-nix";
import "prismjs/components/prism-shell-session";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-yaml";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/plugins/command-line/prism-command-line";
import "prismjs/plugins/command-line/prism-command-line.css";
import Playground from "../components/playground";
import {modes} from "../components/repl";

// Escaping curly braces and other stuff in JSX is tiring, so we define all code examples here
const codeExamples = {
    withNix: {
        clone: `$ git clone git@github.com:tweag/nickel.git
Cloning in 'nickel'...
[..]
$ cd nickel
devops@nickel-lang:~/nickel$`,
        build: `devops@nickel-lang:~/nickel$ nix build
[1 built, 0.0 MiB DL]
devops@nickel-lang:~/nickel$`,
        run: `devops@nickel-lang:~/nickel$ ./result/bin/nickel -V
nickel 0.1.0
devops@nickel-lang:~/nickel$ `,
    },
    firstConfig: `{
  name = "example",
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
      url = "https=//example.com/ivylane"
    }],
  dependencies = {
    dep1 = "^1.0.0",
    dep3 = "6.7"
  }
}`,
    export: `devops@nickel-lang:~/nickel$ nickel -f example.ncl export --format yaml
---
contributors:
  - email: johndoe@example.com
    name: John Doe
  - name: Ivy Lane
    url: https=//example.com/ivylane
dependencies:
  dep1: ^1.0.0
  dep3: "6.7"
description: "This is an awesome software I'm developing.\\nPlease use it!"
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
    return (
        <Layout>
            <main className="container main-container">
                <h1 id="getting-started">Getting started</h1>

                <p>Nickel is quite new and not yet distributed using the standard channels
                    (binaries, nix package, Rust crate, and so on). We are sorry if the installation
                    process is not yet optimal, but this should change soon, so stay tuned.</p>

                <h2 id="build-from-source-using-nix">Build from source using Nix</h2>

                <p>Using <a href="&quot;https://nixos.org/&quot;">Nix</a> is the easiest way to get a Nickel executable
                    running:</p>

                <ol>
                    <li><p>Clone the <a href="https://github.io/tweag/nickel">Nickel repository</a>
                        locally and set it as the current directory:</p>

                        <pre><code>{codeExamples.withNix.clone}</code></pre>
                    </li>
                    <li><p>Invoke nix build:</p>
                        <pre><code>{codeExamples.withNix.build}</code></pre>
                    </li>
                    <li><p>If everything went right, a binary is now available in the
                        result directory:</p>
                        <pre><code>{codeExamples.withNix.run}</code></pre>
                    </li>
                </ol>

                <h2 id="build-from-source-without-nix">Build from source without Nix</h2>

                <p>You will find alternative ways to build Nickel from source by cloning the <a
                    href="href=&quot;https://github.io/tweag/nickel">repository</a> and following the
                    instructions of the <a
                        href="href=&quot;https://github.com/tweag/nickel/#getting-started&quot;">README</a>.</p>

                <h2 id="write-your-first-configuration">Write your first configuration</h2>

                <p> Nickel has a ton of cool features, like gradual typing, contracts and a merge
                    system. However, you&#39;ll only have to deal with them once you need them. Writing
                    basic configuration is almost as writing JSON or YAML. Let us start with a
                    basic fictional app configuration:</p>

                <Playground fit={'code'} mode={modes.YAML} value={codeExamples.firstConfig}/>

                <p>This program describes a record delimited
                    by <code>{'{'}</code> and <code>{'}'}</code>, consisting in a list of
                    key-value pairs, akin to JSON&#39;s objects. Nickel basic datatypes include strings
                    delimited by <code>&quot;</code> and lists, by <code>[</code> and <code>]</code>.</p>
                <p>The m#&quot; and &quot;#m delimits multiline strings. In such strings, the common
                    indentation prefix is stripped, and special characters (excepted
                    interpolation #{}) loose their meaning. It is useful for two purpose
                    illustrated here:</p>
                <ul>
                    <li>Writing strings spanning multiple lines while keeping the same
                        indentation as code.
                    </li>
                    <li>Writing strings with special characters in it, without having to
                        escape them (&quot;, \, and so on).
                    </li>
                </ul>
                <h2 id="export">Export</h2>
                <p>Now, save the content in &quot;example.ncl&quot; and run nickel export (or
                    ./result/bin/nickel export if you haven&#39;t made a symbolic link):</p>
                <pre><code>{codeExamples.export}</code></pre>

                <p>Currently supported formats are yaml, toml, json, and raw. json is the
                    default, while raw expect a string result that it output directly, useful to
                    generate e.g. shell scripts or other custom data.</p>

                <h2 id="reuse">Reuse</h2>

                <p>Nickel is a programming language. This allows you not only to describe, but to
                    generate data. There&#39;s some repetition in our previous example (reproducing only
                    the interesting part):</p>
                <pre><code>{codeExamples.reuse.problem}</code></pre>

                <p>Apart from aesthetics, a more serious issue is inconsistency. If you bump the
                    version number in version, you may forget to do so in the test scripts as well,
                    leading to an incorrect configuration. To remedy this problem, let us have a
                    single source of truth by reusing the value of name and version in test, using
                    the interpolation syntax <code>#{'{expr}'}</code>:</p>
                <pre><code>{codeExamples.reuse.diff}</code></pre>

                <p>Now, if we change version to &quot;0.1.2&quot; and export the result, the test script
                    invocation is updated as well:</p>

                <pre><code>{codeExamples.reuse.result}</code></pre>

                <h2 id="going-further">Going further</h2>

                <p>This was a short introduction that should get you started. But Nickel is a
                    full-fledged programming language, featuring higher-order functions, gradual
                    typing, contracts, and much more.</p>
            </main>
        </Layout>
    );
};

export default IndexPage