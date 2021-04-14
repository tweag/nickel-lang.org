import * as React from "react"
import Layout from "../components/layout"
import { Link } from "gatsby"

// markup
const IndexPage = () => {
  return (
      <Layout>
        <main className="container main-container">
          <h1 className="main-title">Getting started</h1>

          <section className="row mt-4">
            <h1 className="col-12">Install</h1>
            <div className="col-12 pt-2">
              Nickel is quite new and not yet distributed using the standard channels
              (binaries, nix package, Rust crate, and so on). We are sorry if the
              installation process is not yet optimal, but this should change soon, so
              stay tuned.

              <h2 className="mt-4">Build from source using Nix</h2>
              Using <a href="https://nixos.org/">Nix</a> is the easiest way to get a
              Nickel executable running:
              <ul>
                <li> Clone the Nickel <a
                    href="https://github.io/tweag/nickel">repository</a>
                  locally and set it as the current directory:
                  <pre className="code"><code>$git clone git@github.com:tweag/nickel.git
Cloning in 'nickel'...
[..]
$cd nickel
                      nickel$</code></pre>
                </li>
                  <li> Invoke nix build:
                    <pre className="code"><code>nickel$nix build
[1 built, 0.0 MiB DL]
                        nickel$</code></pre></li>
                    <li> If everything went right, a binary is now available in the
                      result directory:
                      <pre className="code"><code>nickel$./result/bin/nickel -V
nickel 0.1.0
nickel$</code></pre>
                    </li>
              </ul>
              <h2>Build from source without Nix</h2>
              You will find alternative ways to build Nickel from source by cloning its <a
                href="https://github.io/tweag/nickel">repository</a> and following
              the instructions of the <a
                href="https://github.com/tweag/nickel/#getting-started">README</a>.
            </div>
          </section>

          <section className="row mt-4">
            <h1 className="col-12">Writing your first configuration</h1>
            <div className="col-12">
              Nickel has a ton of cool features, like gradual typing, contracts
              and a merge system. However, you'll only have to deal with them once
              you need them. Writing basic configuration is almost as writing JSON
              or YAML. Let us start with a basic fictional app configuration:

              <pre className="code"><code>{`{
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
              }`}</code></pre>

              This program describe a record delimited by {'{'} and {'}'}, consisting in a list of
              key-value pairs, akin to JSON's objects. Nickel basic datatypes include
              strings delimited by "" and lists, by [ and ].

              <p>The m#" and "#m delimits multiline strings. In such strings, the common
                indentation prefix is stripped, and special characters (excepted
                interpolation #{}) loose their meaning. It is useful for two purpose
                illustrated here:
                <ul>
                  <li> Writing strings spanning multiple lines while keeping the same
                      indentation as code.</li>
                    <li> Writing strings with special characters in it, without having to
                        escape them (", \, and so on).</li>
                </ul>
              </p>
            </div>

            <div className="col-12">
              <h2>Export</h2>
              Now, save the content in "example.ncl" and run nickel export (or
              ./result/bin/nickel export if you haven't made a symbolic link):

              <pre className="code"><code>nickel$ nickel -f example.ncl export --format yaml
---
contributors:
  - email: johndoe@example.com
    name: John Doe
  - name: Ivy Lane
    url: https=//example.com/ivylane
dependencies:
  dep1: ^1.0.0
  dep3: "6.7"
description: "This is an awesome software I'm developing.\nPlease use it!"
keywords:
  - example
  - config
main: index.js
name: example
scripts:
  do_stuff: do_stuff.sh subcommand
  test: "test.sh --option --install example --version \"0.1.1\""
version: 0.1.1
</code></pre>

              Currently supported formats are yaml, toml, json, and raw. json is the
              default, while raw expect a string result that it output directly, useful to
              generate e.g. shell scripts or other custom data.

            </div>
            <div className="col-12 mt-2">
              <h2>Reuse</h2>
              Nickel is a programming language. This allows you not only to describe, but
              to generate data. There's some repetition in our previous example
              (reproducing only the interesting part):

              <pre><code>name = "example",
version = "0.1.1",
scripts = {'{'}
                  test = m#"test.sh --option --install example --version "0.1.1""#m,</code></pre>

                  Apart from aesthetics, a more serious issue is inconsistency. If you bump
                  the version number in version, you may forget to do so in the test scripts
                  as well, leading to an incorrect configuration. To remedy this problem, let
                  us have a single source of truth by reusing the value of name and version in
                  test, using the interpolation syntax {'#{expr}'}:

                  <pre><code>{`name = "example",
version = "0.1.1",
scripts = {
  test = m#"test.sh --option --install {'#{name}'} --version {'"#{version}""#m'},`}</code></pre>

                  Now, if we change version to "0.1.2" and export the result, the test script
                  invocation is updated as well:
                  <pre><code>[...]
                  scripts:
                  do_stuff: do_stuff.sh subcommand
                  test: "test.sh --option --install example --version \"0.1.2\""
                  version: 0.1.2</code></pre>

                  </div>
                  <div>
                  <h2>Going further</h2>
                  This was a very short introduction that should get you started. But
                  Nickel is a full-fledged programming language, featuring higher-order
                  functions, gradual typing, contracts, and much more. You'll find more
                  resources on the <Link to="/documentation">Documentation</Link> page.
                  </div>
                  </section>
                  </main>
      </Layout>
  )
}

export default IndexPage
