// src/components/GenealogyStory/GenealogyStory.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "../Navbar/Navbar.jsx";

import StoryBlock from "./StoryBlock";
import { storyImages } from "../../data/storyImages.js";

import "../../blocks/genealogyStory.css";

function GenealogyStory() {
  const navigate = useNavigate();

  const { t } = useTranslation("genealogyStory");

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ================= ALL STORY SECTIONS =================
  const sections = t("sections", {
    returnObjects: true,
  });

  // ================= HERO PARAGRAPHS =================
  const heroParagraphs = t("hero.paragraphs", {
    returnObjects: true,
  });

  return (
    <section className="story">
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= BACK BUTTON ================= */}
      <button
        className="story__back-button"
        onClick={() => navigate("/genealogy")}
      >
        ← {t("back")}
      </button>

      {/* ================= HERO ================= */}
      <div className="story__hero">
        <h1 className="story__hero-title">{t("hero.title")}</h1>

        {Array.isArray(heroParagraphs) ? (
          heroParagraphs.map((paragraph, index) => (
            <p key={index} className="story__hero-paragraph">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="story__hero-paragraph">{heroParagraphs}</p>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="story__container">
        {/* ================= STORY BLOCKS ================= */}
        {Array.isArray(sections) &&
          sections.map((section) => (
            <StoryBlock
              key={section.id}
              title={section.title}
              paragraphs={section.paragraphs}
              caption={section.image.caption}
              image={storyImages[section.image.src]}
              alt={section.image.alt}
              reverse={section.layout === "reverse"}
            />
          ))}

        {/* ================= HIGHLIGHT ================= */}
        <div className="story__highlight">
          <h2 className="story__subheading">{t("highlight.title")}</h2>

          <p className="story__paragraph">{t("highlight.paragraph")}</p>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="story__footer">
          <p className="story__paragraph">{t("footer.quote")}</p>
        </div>
      </div>

      {/* ================= SCROLL TOP ================= */}
      {showScrollTop && (
        <button
          className="story__scroll-top"
          aria-label={t("scrollTop.label")}
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          ↑
        </button>
      )}
    </section>
  );
}

export default GenealogyStory;
