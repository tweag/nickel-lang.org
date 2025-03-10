import * as React from "react"
import Layout from "../components/layout"
import {StaticImage} from "gatsby-plugin-image";
import mergeImage from '../images/merge-2.png';
import validateImage from '../images/validate-2.png';
import reuseImage from '../images/reuse-2.png';
import PlaygroundComponent from "../components/playground-clientside";
import modes from "../components/playground/modes";
import {Command} from "react-bootstrap-icons";
import {
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const codeExample = `let conf = {
  name = "NiCl",
  version  = "0.0.1$",
  description = "My cool app!"
} in

let SemanticVersion = fun label value =>
  let pattern = "^\\\\d{1,2}\\\\.\\\\d{1,2}(\\\\.\\\\d{1,2})?$" in
  if std.string.is_match pattern value then
    value
  else
    let msg = "invalid version number" in
    std.contract.blame_with_message msg label
  in

let AppSchema = {
  name | String,
  version | SemanticVersion,
  description | String,
} in

conf | AppSchema`;

/**
 * Scroll offset after which the scrolldown arrow is hidden, in pixels.
 * @type {number}
 */
const HIDE_SCROLLDOWN_ARROW_AFTER = 100;

const IndexPage = () => {
  const [isArrowVisible, setArrowVisible] = React.useState(true);

  const onScroll = () => {
    const currentScroll = document.body.scrollTop || document.documentElement.scrollTop;

    if(isArrowVisible && currentScroll > HIDE_SCROLLDOWN_ARROW_AFTER) {
      setArrowVisible(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () =>
        window.removeEventListener('scroll', onScroll);
  }, []);

  return (
      <Layout>
        <main className="container main-container">
          <section className="row first-section-block">
            <div className="col-12 text-center">
              <h1 className="main-title mb-4"><StaticImage className={"logo"} src="../images/nickel-logo-2.svg" alt="logo"/><span className="nickel">Nickel</span></h1>
              <div className="main-subtitle mt-4 mb-4 title-font">Better configuration
                for less
              </div>

              <div className="mt-4 mb-4 main-text">
                Write complex configurations. Modular, correct and boilerplate-free.
              </div>
            </div>
          </section>

          <hr className={'horizontal-sep d-none d-md-block'}/>

          <section className={'row section-block d-none d-md-block'}>
            <div className="col-12 text-center">
              <h2 className="mb-4">Try it out. Find the <span className={'landingpage-error'}>error</span>!</h2>
              <div className="mt-4 mb-4 main-text">
                This configuration contains an error. Fix it and press <kbd>Ctrl</kbd>+<kbd>Enter</kbd> (or <kbd>Cmd <Command/>
              </kbd>+<kbd>Enter</kbd>) or click <span className={'btn btn-primary disabled'}>Run</span> to try your solution.
              </div>
              <div className={'text-start landingpage-playground-wrapper'}>
                <PlaygroundComponent value={codeExample} fit={'code'} mode={modes.JSON}/>
              </div>
            </div>
          </section>

          <hr className={'horizontal-sep'}/>

          <section className="row last-section-block">
            <div className="col-12 col-lg-4 mb-5 mb-lg-0 main-text text-center landingpage-column">
              <img src={mergeImage} className="abstract-illustration" alt={""}/>
                <h3 className="mb-4 mt-4">Merge</h3>
                <div className="text-start mt-4">
                    Write simple, modular blocks. Merge them into a complex configuration.
                </div>
            </div>
            <div className="col-12 col-lg-4 mb-5 mb-lg-0 main-text text-center landingpage-column">
              <img src={validateImage} className="abstract-illustration" alt={""}/>
                <h3 className="mb-4 mt-4">Verify & Validate</h3>
              <div className="text-start mt-4">
                <p>Use (opt-in) static typing to verify functions, if you need to. Let
                type inference do the boring work.</p>

                <p>Use contracts
                  to validate your data and ensure they conform to a given schema.</p>
              </div>
            </div>
            <div className="col-12 col-lg-4 main-text text-center landingpage-column">
              <img src={reuseImage} className="abstract-illustration" alt={""}/>
                <h3 className="mb-4 mt-4">Reuse</h3>
              <div className="text-start lt-4">
                Don't use hacks, don't reinvent the wheel: Nickel is a
                programming language. Factorize. Reuse the generic parts. Import external libraries.
              </div>
            </div>
          </section>
          {isArrowVisible && <FontAwesomeIcon icon={faChevronDown} className={'scroll-down-arrow'}/>}
        </main>
      </Layout>
  )
};

export default IndexPage
