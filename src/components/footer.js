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
        </div>
        <hr/>
        <div className="text-center p-3">
            © 2021 Copyright:
            Nickel contributors
        </div>
    </footer>
)

export default Footer