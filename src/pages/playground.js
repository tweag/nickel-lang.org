import * as React from "react"
import Layout from "../components/layout"

// markup
const IndexPage = () => {
  return (
      <Layout>
        <main className="container main-container">
          <h1 className="main-title">Playground</h1>

          <div className="row">
            <div className="col-12">
              Experiment with the online Nickel REPL!
            </div>
            <div className="col-12 playground"> Playground here</div>
          </div>
        </main>
      </Layout>
  )
}

export default IndexPage
