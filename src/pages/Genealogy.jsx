// src/pages/Genealogy.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar/Navbar";
import GenealogyTreeD3 from "../components/GenealogyTreeD3/GenealogyTreeD3";
import { getFamilyData } from "../utils/storage";

import "../blocks/genealogy.css";

import bisnoni from "../assets/images/bisnoni.png";
import we from "../assets/images/my_family.png";
import map from "../assets/images/italy_small_map.png";
import art from "../assets/images/b.png";
import dna from "../assets/images/icon_dna.png";
import figure from "../assets/images/icon_people.png";
import atom from "../assets/images/icon_atom.png";
import planet from "../assets/images/icon_planet.png";
import people from "../assets/images/family_people.png";
import ball from "../assets/images/family_ball.png";
import tree from "../assets/images/bkg-tree.png";
import image from "../assets/images/bkg_history.png";
import arrow from "../assets/images/arrow_roots2.png";

export default function Genealogy() {
  const { t } = useTranslation(["genealogy", "genealogyTreeD3"]);

  /* ================= STATE ================= */
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTreeExpanded, setIsTreeExpanded] = useState(false);

  /* ================= LOAD FROM STORAGE ================= */
  useEffect(() => {
    const saved = getFamilyData();

    setTimeout(() => {
      if (saved) {
        setFamily(saved);
      } else {
        setFamily({
          id: "1",
          name: t("noData"),
          relation: "",
          children: [],
        });
      }

      setLoading(false);
    }, 1000);
  }, [t]);

  /* ================= SCROLL REVEAL ================= */
  useEffect(() => {
    const elements = document.querySelectorAll(".genealogy__reveal");

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("genealogy__reveal_active");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  /* ================= RENDER ================= */
  return (
    <section className="genealogy">
      <Navbar />

      <div className="genealogy__grid genealogy__reveal">
        {/* COLUMN 1 */}
        <div className="genealogy__col">
          {/* ROOTS */}
          <div className="genealogy__card genealogy__card_blue genealogy__roots">
            <div className="genealogy__roots-photos">
              <div className="genealogy__roots-content genealogy__roots-content_left">
                <img
                  src={we}
                  alt={t("alt.familyPhoto")}
                  className="genealogy__roots-image genealogy__roots-image_left"
                />
              </div>

              <div className="genealogy__roots-content genealogy__roots-content_right">
                <img
                  src={bisnoni}
                  alt={t("alt.greatGrandparents")}
                  className="genealogy__roots-image genealogy__roots-image_right"
                />
              </div>
            </div>

            <h1 className="genealogy__roots-title">{t("rootsTitle")}</h1>

            <div className="genealogy__roots-icons">
              <span className="genealogy__roots-span">
                <img
                  className="genealogy__roots-icon genealogy__roots-icon_dna"
                  src={dna}
                  alt={t("alt.dna")}
                />
              </span>

              <span className="genealogy__roots-span">
                <img
                  className="genealogy__roots-icon genealogy__roots-icon_people"
                  src={figure}
                  alt={t("alt.people")}
                />
              </span>

              <h2 className="genealogy__roots-text">{t("roots")}</h2>

              <span className="genealogy__roots-span">
                <img
                  className="genealogy__roots-icon genealogy__roots-icon_atom"
                  src={atom}
                  alt={t("alt.atom")}
                />
              </span>

              <span className="genealogy__roots-span">
                <img
                  className="genealogy__roots-icon genealogy__roots-icon_planet"
                  src={planet}
                  alt={t("alt.planet")}
                />
              </span>
            </div>

            <div className="genealogy__roots-arrow-container">
              <img
                className="genealogy__roots-arrow-image"
                src={arrow}
                alt={t("alt.arrow")}
              />
            </div>
          </div>

          {/* FAMILY INFO */}
          <div className="genealogy__card genealogy__card_sand genealogy__info">
            <div className="genealogy__info-icons">
              <div className="genealogy__info-icon">
                <img
                  className="genealogy__info-icon genealogy__info-icon_people"
                  src={people}
                  alt={t("alt.people")}
                />
              </div>
              <div className="genealogy__info-icon">
                <img
                  className="genealogy__info-icon genealogy__info-icon_ball"
                  src={ball}
                  alt={t("alt.ball")}
                />
              </div>
            </div>

            <h3 className="genealogy__info-title">{t("familyName")}</h3>

            <p className="genealogy__info-paragraph">{t("familyHistory")}</p>

            <div className="genealogy__info-family">
              {loading ? (
                <div className="genealogy__loader">
                  <span className="dot dot-on"></span>
                  <span className="dot dot-tw"></span>
                  <span className="dot dot-tr"></span>
                </div>
              ) : family ? (
                <div className="genealogy__ancestry">
                  <h3 className="genealogy__ancestry genealogy__ancestry_name">
                    {family.name}
                  </h3>

                  <p className="genealogy__ancestry genealogy__ancestry_relation">
                    {t(family.relation, { ns: "genealogyTreeD3" })}
                  </p>
                </div>
              ) : (
                <p>{t("noData")}</p>
              )}
            </div>
          </div>

          {/* FAMILY TREE */}
          <div
            className={`genealogy__card genealogy__card_blue genealogy__tree
  ${isTreeExpanded ? "genealogy__tree--expanded" : ""}`}
          >
            <h4 className="genealogy__tree-text">{t("familyTree")}</h4>

            {!isTreeExpanded ? (
              <div className="genealogy__tree-preview">
                <img
                  src={tree}
                  alt="Genealogy Preview"
                  className="genealogy__tree-preview-image"
                />

                <button
                  className="genealogy__tree-preview-button"
                  onClick={() => {
                    setIsTreeExpanded(true);

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  {t("viewTree")}
                </button>
              </div>
            ) : (
              <GenealogyTreeD3
                data={family}
                setData={setFamily}
                isExpanded={isTreeExpanded}
                setIsExpanded={setIsTreeExpanded}
              />
            )}
          </div>
        </div>

        {/* COLUMN 2 */}
        <div className="genealogy__col">
          {/* ORIGIN */}
          <div className="genealogy__card genealogy__card_sand genealogy__card_sand_origen">
            <h4 className="genealogy__origin-title ">{t("origin")}</h4>

            <div className="genealogy__origin-content">
              <div className="genealogy__origin-map ">
                <img
                  src={map}
                  alt={t("alt.italyMap")}
                  className="genealogy__origin-image"
                ></img>
              </div>

              <div className="genealogy__origin-info ">
                <p className="genealogy__origin-paragraph">{t("country")}</p>

                <span className="genealogy__origin-span">{t("region")}</span>

                <small className="genealogy__origin-small">
                  {t("perugia")}
                </small>
              </div>

              <div className="genealogy__origin-art">
                <img
                  className="genealogy__origin-artwork"
                  src={art}
                  alt={t("alt.church")}
                />
              </div>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="genealogy__card genealogy__card__dark genealogy__timeline">
            <h4 className="genealogy__timeline-title">{t("timeline")}</h4>

            {/* YEARS */}
            <div className="genealogy__timeline-years">
              <span>1500</span>
              <span>1861</span>
              <span>1897</span>
              <span>2026</span>
            </div>

            {/* LINE */}
            <div className="genealogy__timeline-line"></div>

            {/* NODES */}
            <div className="genealogy__timeline-nodes">
              <div className="genealogy__timeline-node">
                <span className="genealogy__timeline-node_span">
                  {t("veniceRepublic")}
                </span>
              </div>

              <div className="genealogy__timeline-node">
                <span className="genealogy__timeline-node_span">
                  {t("italy")}
                </span>
              </div>

              <div className="genealogy__timeline-node">
                <span className="genealogy__timeline-node_span">
                  {t("brazil")}
                </span>
              </div>

              <div className="genealogy__timeline-node">
                <span className="genealogy__timeline-node_span">
                  {t("saoPaulo")}
                </span>
              </div>
            </div>
          </div>

          {/* STORY */}
          <div className="genealogy__card genealogy__card_sand genealogy__history">
            <div className="genealogy__history-container">
              <h4 className="genealogy__history-title">{t("storytelling")}</h4>

              <p className="genealogy__history-paragraph">
                {t("storyDescription")}
              </p>

              <div className="genealogy__history-background">
                <img
                  className="genealogy__history-image"
                  src={image}
                  alt={t("alt.book")}
                />
              </div>

              <Link to="/story" className="genealogy__history-link">
                {t("viewStory")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="genealogy__footer">
        <p className="genealogy__quote">{t("quote")}</p>
      </div>
    </section>
  );
}
