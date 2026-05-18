// src/components/Main/Main.jsx

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import SearchForm from "./components/SearchForm/SearchForm";
import Preloader from "./components/Preloader/Preloader";
import Gallery from "./components/Gallery/Gallery";

import { searchArtworks } from "../../utils/europeanaApi";

function Main({ onImageClick, artworks, setArtworks }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useTranslation("main");

  function handleSearch(query) {
    setIsLoading(true);

    searchArtworks(query)
      .then((data) => {
        setArtworks(data);
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    let isMounted = true;
    let timer;

    const start = Date.now();

    searchArtworks("*")
      .then((data) => {
        if (isMounted) {
          setArtworks(data);
        }
      })
      .catch(console.error)
      .finally(() => {
        const elapsed = Date.now() - start;
        const minTime = 500;

        timer = setTimeout(
          () => {
            if (isMounted) {
              setIsLoading(false);
            }
          },
          Math.max(0, minTime - elapsed),
        );
      });

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const filteredArtworks = artworks.filter((art) =>
    art.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="content" id="content">
      <button
        className="content__back"
        onClick={() => {
          const header = document.querySelector(".header");
          if (header) {
            header.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        ← {t("home")}
      </button>

      <SearchForm
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      {isLoading && <Preloader />}

      <Gallery artworks={filteredArtworks} onImageClick={onImageClick} />
    </main>
  );
}

export default Main;
