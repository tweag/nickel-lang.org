import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"

const Header = ({ siteTitle, menuLinks }) => (
    <header>
        <nav className="navbar navbar-expand-lg navbar-light navbar-dark bg-primary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Nickel</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNavAltMarkup"
                        aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav mx-auto">
                        {menuLinks.map(link => (
                            <Link key={link.name} className="nav-link" activeClassName="active" to={link.link}>{link.name}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    </header>
)
Header.propTypes = {
    siteTitle: PropTypes.string,
}
Header.defaultProps = {
    siteTitle: ``,
}
export default Header