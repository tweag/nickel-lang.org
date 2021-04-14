import * as React from "react"
import Layout from "../components/layout"
import {StaticImage} from "gatsby-plugin-image";

// markup
const IndexPage = () => {
  return (
      <Layout>
        <main className="container main-container">
          <section className="row section-block">
            <div className="col text-center">
              <h1 className="main-title mb-4"><StaticImage className="logo" src="" alt="logo"/> <span
                  className="align-bottom">Nickel</span></h1>
              <div className="main-subtitle mb-4">Better configuration
                for less
              </div>

              <div className="mt-4 mb-4 main-text">
                Nickel is a configuration programming language. Write
                complex configurations in a modular, correct and
                boilerplate-free manner.
              </div>
            </div>
            <div className="col">
              <asciinema-player src="demos/cover.cast"/>
            </div>
          </section>

          <section className="row section-block">
            <div className="col-4 main-text text-center landingpage-column">
              <StaticImage src="../images/filler.svg.png" className="abstract-illustration" alt={""}/>
                <h3>Merge</h3>
                <div className="text-left">
                    Write your configuration as logical blocks in a modular
                      way.
                      Combine them in a customizable way to assemble complex
                      configurations.
                </div>
            </div>
            <div className="col-4 main-text text-center landingpage-column">
              <StaticImage src="../images/filler.svg.png" className="abstract-illustration" alt={""}/>
                <h3>Verify & Validate</h3>
                Use types to specify and verify functions, if you want to. Let
                the type inference engine do the boring work. Use contracts to
                encode arbitrary schemas and validate your configuration data.
            </div>
            <div className="col-4 main-text text-center landingpage-column">
              <StaticImage src="../images/filler.svg.png" className="abstract-illustration" alt={""}/>
                <h3>Reuse</h3>
                Don't hack, don't reinvent the wheel: Nickel is a proper
                programming language. Factorize and reuse the generic aspects of
                configuration, or use existing librairies.
            </div>
          </section>
        </main>
      </Layout>
  )
}

export default IndexPage
