import * as React from "react"
import Layout from "../components/layout"
import {StaticImage} from "gatsby-plugin-image";
import moleculeSVG from '../images/molecules.svg';
import atomSquareSVG from '../images/atom-square.svg';
import PlaygroundComponent from "../components/playground";

const IndexPage = () => {
  return (
      <Layout>
        <main className="container main-container">
          <section className="row section-block">
            <div className="col-12 text-center">
              <h1 className="main-title mb-4"><StaticImage className="logo" src="../images/icon.png" alt="logo"/><span className="align-top">Nickel</span></h1>
              <div className="main-subtitle mb-4">Better configuration
                for less
              </div>

              <div className="mt-4 mb-4 main-text">
                Write complex configurations in a modular, correct and
                boilerplate-free manner.
              </div>
            </div>
          </section>

          <PlaygroundComponent/>

          <section className="row section-block">
            <div className="col-4 main-text text-center landingpage-column">
              <img src={moleculeSVG} className="abstract-illustration" alt={""}/>
                <h3 className="mb-4 mt-4">Merge</h3>
                <div className="text-left">
                    Write your configuration as simple, modular blocks.
                   Merge them into a complex configuration.
                </div>
            </div>
            <div className="col-4 main-text text-center landingpage-column">
              <img src={atomSquareSVG} className="abstract-illustration" alt={""}/>
                <h3 className="mb-4 mt-4">Verify & Validate</h3>
              <div className="text-left">
                Use opt-in static typing to specify and verify functions if you need to. Let
                type inference do the boring work. Use contracts
                to validate your data and ensure they conform to a given schema.
              </div>
            </div>
            <div className="col-4 main-text text-center landingpage-column">
              <img src={moleculeSVG} className="abstract-illustration" alt={""}/>
                <h3 className="mb-4 mt-4">Reuse</h3>
              <div className="text-left">
                Don't hack, don't reinvent the wheel: Nickel is a
                programming language. Factorize and reuse the generic parts. Use existing libraries.
              </div>
            </div>
          </section>
        </main>

        <script src="../asciinema-player/asciinema-player.js"/>
      </Layout>
  )
};

export default IndexPage
