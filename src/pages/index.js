import * as React from "react"
import Layout from "../components/layout"
import {StaticImage} from "gatsby-plugin-image";

import atomSVG from '../images/atom-electrons.svg';
import moleculeSVG from '../images/molecules.svg';
import atomSquareSVG from '../images/atom-square.svg';

const IndexPage = () => {
  return (
      <Layout>
        <main className="container main-container">
          <section className="row section-block">
            <div className="col text-center">
              <h1 className="main-title mb-4"><StaticImage className="logo" src="../images/icon.png" alt="logo"/><span className="align-top">Nickel</span></h1>
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
              <iframe title="asciinema" className="asciinema-iframe" allowFullScreen={true} webkitallowfullscreen="true" mozallowfullscreen="true"
                      src="https://asciinema.org/a/3CG6L6oAfimqtDkoxiUu6VOws/iframe"/>
              {/*<script id="asciicast-3CG6L6oAfimqtDkoxiUu6VOws" src="https://asciinema.org/a/3CG6L6oAfimqtDkoxiUu6VOws.js" async/>*/}
            </div>
          </section>

          <section className="row section-block">
            <div className="col-4 main-text text-center landingpage-column">
              <img src={atomSVG} className="abstract-illustration" alt={""}/>
                <h3 className="mb-4 mt-4">Merge</h3>
                <div className="text-left">
                    Write your configuration as logical blocks in a modular
                      way.
                      Combine them in a customizable way to assemble complex
                      configurations.
                </div>
            </div>
            <div className="col-4 main-text text-center landingpage-column">
              <img src={atomSquareSVG} className="abstract-illustration" alt={""}/>
                <h3 className="mb-4 mt-4">Verify & Validate</h3>
              <div className="text-left">
                Use types to specify and verify functions, if you want to. Let
                the type inference engine do the boring work. Use contracts to
                encode arbitrary schemas and validate your configuration data.
              </div>
            </div>
            <div className="col-4 main-text text-center landingpage-column">
              <img src={moleculeSVG} className="abstract-illustration" alt={""}/>
                <h3 className="mb-4 mt-4">Reuse</h3>
              <div className="text-left">
                Don't hack, don't reinvent the wheel: Nickel is a proper
                programming language. Factorize and reuse the generic aspects of
                configuration, or use existing librairies.
              </div>
            </div>
          </section>
        </main>

        <script src="../asciinema-player/asciinema-player.js"/>
      </Layout>
  )
};

export default IndexPage
