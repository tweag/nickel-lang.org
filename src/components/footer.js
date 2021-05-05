import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGithub,
    faTwitter,
    faDiscourse,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => (
    <footer className="bg-primary text-center text-white">
        <div className="container p-4">
            <section className="mb-4">
                <Link className="btn btn-outline-light btn-floating m-1" to="#!" role="button"
                ><FontAwesomeIcon icon={faTwitter}/></Link>

                <Link className="btn btn-outline-light btn-floating m-1" to="#!" role="button"
                ><FontAwesomeIcon icon={faGithub}/></Link>

                <Link className="btn btn-outline-light btn-floating m-1" to="#!" role="button"
                ><FontAwesomeIcon icon={faDiscourse}/></Link>
            </section>

            {/*<section className="">*/}
            {/*    <div className="row">*/}
            {/*        <div className="col-lg-3 col-md-6 mb-4 mb-md-0">*/}
            {/*            <h5>Section</h5>*/}

            {/*            <ul className="list-unstyled mb-0">*/}
            {/*                <li>*/}
            {/*                    <Link to="#!" className="text-white">Link 1</Link>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <Link to="#!" className="text-white">Link 1</Link>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <Link to="#!" className="text-white">Link 1</Link>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <Link to="#!" className="text-white">Link 1</Link>*/}
            {/*                </li>*/}
            {/*            </ul>*/}
            {/*        </div>*/}

            {/*        <div className="col-lg-3 col-md-6 mb-4 mb-md-0">*/}
            {/*            <h5>Section</h5>*/}

            {/*            <ul className="list-unstyled mb-0">*/}
            {/*                <li>*/}
            {/*                    <Link to="#!" className="text-white">Link 1</Link>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <Link to="#!" className="text-white">Link 1</Link>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <Link to="#!" className="text-white">Link 1</Link>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <Link to="#!" className="text-white">Link 1</Link>*/}
            {/*                </li>*/}
            {/*            </ul>*/}
            {/*        </div>*/}

            {/*        <div className="col-lg-3 col-md-6 mb-4 mb-md-0">*/}
            {/*            <h5>Section</h5>*/}

            {/*            <ul className="list-unstyled mb-0">*/}
            {/*                <li>*/}
            {/*                    <Link to="#!" className="text-white">Link 1</Link>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <Link to="#!" className="text-white">Link 1</Link>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <Link to="#!" className="text-white">Link 1</Link>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <Link to="#!" className="text-white">Link 1</Link>*/}
            {/*                </li>*/}
            {/*            </ul>*/}
            {/*        </div>*/}

            {/*        <div className="col-lg-3 col-md-6 mb-4 mb-md-0">*/}
            {/*            <h5>Section</h5>*/}

            {/*            <ul className="list-unstyled mb-0">*/}
            {/*                <li>*/}
            {/*                    <Link to="#!" className="text-white">Link 1</Link>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <Link to="#!" className="text-white">Link 1</Link>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <Link to="#!" className="text-white">Link 1</Link>*/}
            {/*                </li>*/}
            {/*                <li>*/}
            {/*                    <Link to="#!" className="text-white">Link 1</Link>*/}
            {/*                </li>*/}
            {/*            </ul>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</section>*/}
        </div>

        <hr/>
        <div className="text-center p-3">
            © 2021 Copyright:
            Nickel contributors
        </div>
    </footer>
)

export default Footer