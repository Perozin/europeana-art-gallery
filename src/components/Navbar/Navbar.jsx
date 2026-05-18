// src/components/Navbar/Navbar.jsx

import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useTheme } from "../../context/ThemeContext";
import "../../blocks/navbar.css";

import logo from "../../assets/images/logo-dark.png";
import menuLight from "../../assets/images/menu-light.png";
import menuDark from "../../assets/images/menu-dark.png";
import moonIcon from "../../assets/images/moon.png";
import sunIcon from "../../assets/images/sun.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const { darkMode, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation("navbar");

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleLangMenu() {
    setLangOpen(!langOpen);
  }

  function changeLanguage(lang) {
    i18n.changeLanguage(lang);
    setLangOpen(false);
    closeMenu();
  }

  return (
    <nav className="nav">
      {/* LOGO */}
      <div className="nav__logo">
        <img src={logo} alt="logo" className="nav__image" />
      </div>

      {/* HAMBURGER BUTTON */}
      <button className="nav__toggle" onClick={toggleMenu}>
        <img
          src={darkMode ? menuDark : menuLight}
          alt="menu"
          className="nav__toggle-icon"
        />
      </button>

      {/* LINKS */}
      <ul className={`nav__links ${menuOpen ? "nav__links_open" : ""}`}>
        <li className="nave__item">
          <Link to="/" onClick={closeMenu}>
            {t("home")}
          </Link>
        </li>

        <li className="nave__item">
          <Link
            to="/"
            onClick={() => {
              closeMenu();
              setTimeout(() => {
                const el = document.getElementById("content");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            {t("search")}
          </Link>
        </li>

        <li className="nav__item">
          <Link to="/genealogy" onClick={closeMenu}>
            {t("genealogy")}
          </Link>
        </li>

        <li className="nav__item">
          <Link to="/author" onClick={closeMenu}>
            {t("about")}
          </Link>
        </li>

        <li className="nav__item">
          <Link to="/contact" onClick={closeMenu}>
            {t("contact")}
          </Link>
        </li>

        {/* LANGUAGE DROPDOWN */}
        <li className="nav__item nav__language">
          <button onClick={toggleLangMenu} className="nav__language-button">
            🌐 {t("language")}
          </button>

          {langOpen && (
            <ul className="nav__language-dropdown">
              <li
                className="nav__language-item"
                onClick={() => changeLanguage("en")}
              >
                🇺🇸 EN
              </li>

              <li
                className="nav__language-item"
                onClick={() => changeLanguage("pt")}
              >
                🇧🇷 PT
              </li>

              <li
                className="nav__language-item"
                onClick={() => changeLanguage("it")}
              >
                🇮🇹 IT
              </li>

              <li
                className="nav__language-item"
                onClick={() => changeLanguage("de")}
              >
                🇩🇪 DE
              </li>
            </ul>
          )}
        </li>

        {/* THEME */}
        <li className="nav__theme-item">
          <button onClick={toggleTheme} className="nav__theme-button">
            <img
              src={darkMode ? sunIcon : moonIcon}
              alt="Toggle theme"
              className="nav__theme-icon"
            />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
