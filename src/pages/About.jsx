// src/pages/About.jsx

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { User, Code, GraduationCap, Palette } from "lucide-react";

import Navbar from "../components/Navbar/Navbar";

import "../blocks/about.css";

import aboutPhoto from "../assets/images/about-foto.png";

export default function About() {
  const { t } = useTranslation("about");

  const [loaded, setLoaded] = useState(false);

  return (
    <section className="about">
      {/* NAV */}
      <Navbar />

      {/* PHOTO */}
      <div className="about__photo-container">
        {!loaded && <div className="about__skeleton"></div>}

        <img
          src={aboutPhoto}
          alt={t("photoAlt")}
          className={`about__photo ${loaded ? "loaded" : ""}`}
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* TITLE */}
      <h2 className="about__title">{t("title")}</h2>

      <p className="about__subtitle">{t("subtitle")} </p>

      {/* CARDS */}
      <div className="about__cards">
        <div className="about__card">
          <h3 className="about__card-title">
            <User size={20} stroke="#FFEB3B" />
            {t("author.title")}
          </h3>

          <ul className="about__card-list">
            <li className="about__card-li">{t("author.item1")}</li>

            <li className="about__card-li">{t("author.item2")}</li>
          </ul>
        </div>

        <div className="about__card">
          <h3 className="about__card-title">
            <Code size={20} stroke="#FF1493" />
            {t("expertise.title")}
          </h3>

          <ul className="about__card-list">
            <li className="about__card-li">{t("expertise.item1")}</li>

            <li className="about__card-li">{t("expertise.item2")}</li>

            <li className="about__card-li">{t("expertise.item3")}</li>

            <li className="about__card-li">{t("expertise.item4")}</li>
          </ul>
        </div>

        <div className="about__card">
          <h3 className="about__card-title">
            <GraduationCap size={20} stroke="#32CD32" />
            {t("journey.title")}
          </h3>

          <ul className="about__card-list">
            <li className="about__card-li">{t("journey.item1")}</li>

            <li className="about__card-li">{t("journey.item2")}</li>

            <li className="about__card-li">{t("journey.item3")}</li>
          </ul>
        </div>

        <div className="about__card">
          <h3 className="about__card-title">
            <Palette size={20} stroke="#FFD700" />
            {t("passions.title")}
          </h3>

          <ul className="about__card-list">
            <li className="about__card-li">{t("passions.item1")}</li>

            <li className="about__card-li">{t("passions.item2")}</li>

            <li className="about__card-li">{t("passions.item3")}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
