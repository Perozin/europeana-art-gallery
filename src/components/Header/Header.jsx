// src/components/Header/Header.jsx

import "../../blocks/header.css";
import Navbar from "../Navbar/Navbar";
import heroImage from "../../assets/images/ArtGallery.png";
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation("header");

  return (
    <header className="header">
      {/* NAV */}
      <Navbar />

      {/* HERO */}
      <div className="header__hero">
        <div className="header__text">
          <h1 className="header__title">
            <span>{t("titleHighlight")}</span>
            {t("title")}
          </h1>

          <p className="header__description">{t("description")}</p>
        </div>

        <div className="header__container">
          <img src={heroImage} alt={t("imageAlt")} className="header__image" />
        </div>
      </div>

      {/* FOOTER HEADER */}
      <div className="header__footer">
        <div className="header__info">
          <p className="header__paragraph">{t("searchTitle")}</p>
          <p className="header__paragraph">{t("search1")}</p>
          <p className="header__paragraph">{t("search2")}</p>
          <p className="header__paragraph">{t("search3")}</p>
        </div>

        <div className="header__info header__info_address">
          <p className="header__paragraph header__paragraph_address">
            {t("location")}
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
