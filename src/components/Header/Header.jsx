// src/components/Header/Header.jsx
import { Link } from "react-router-dom";
import "../../blocks/header.css";
import heroImage from "../../assets/images/ArtGallery.png";
import logo from "../../assets/images/logo_white.png";

function Header() {
  return (
    <header className="header">
      {/* NAV */}
      <nav className="nav">
        <div className="nav__logo">
          <img src={logo} alt="nav logo image" className="nav__logo-image" />
        </div>

        <div className="nav__links">
          <Link to="/">Home</Link>
          <Link to="/author">About Me</Link>
          <Link to="/app">About App</Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="header__hero">
        <div className="header__text">
          <h1 className="header__title">
            <span>European Art</span>
            Explorer
          </h1>

          <p className="header__description">
            Explore artworks from European museums in a modern and immersive
            way.
          </p>
        </div>

        <img
          src={heroImage}
          alt="Art gallery illustration"
          className="header__image"
        />
      </div>

      {/* FOOTER HEADER */}
      <div className="header__footer">
        <div>
          <p className="label">Author</p>
          <p>Marcio Perozin</p>
        </div>

        <div>
          <p className="label">Job</p>
          <p>Full-Stack Developer</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
