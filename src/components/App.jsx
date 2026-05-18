// src/components/App.js
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./Header/Header";
import SearchForm from "../components/Main/components/SearchForm/SearchForm";
import Preloader from "../components/Main/components/Preloader/Preloader";
import Gallery from "../components/Main/components/Gallery/Gallery";
import Footer from "./Footer/Footer";
import Modal from "../components/Main/components/Modal/Modal";

import AboutAuthor from "../pages/AboutAuthor";
import AboutApp from "../pages/AboutApp";

import { searchArtworks } from "../utils/europeanaApi";

function App() {
  const [artworks, setArtworks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  function handleSearch(query) {
    setIsLoading(true);

    searchArtworks(query)
      .then((data) => {
        setArtworks(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar artworks:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    setIsLoading(true);

    searchArtworks("*")
      .then((data) => {
        setArtworks(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar artworks:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredArtworks = artworks.filter((art) =>
    art.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedArtwork =
    selectedIndex !== null ? filteredArtworks[selectedIndex] : null;

  function handleNext() {
    setSelectedIndex((prev) =>
      prev < filteredArtworks.length - 1 ? prev + 1 : prev,
    );
  }

  function handlePrev() {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }

  return (
    <BrowserRouter>
      <div className="page">
        <Header />

        <div style={{ flex: 1 }}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SearchForm
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearch={handleSearch}
                  />

                  {isLoading && <Preloader />}

                  <Gallery
                    artworks={filteredArtworks}
                    onImageClick={setSelectedIndex}
                  />
                </>
              }
            />

            <Route path="/author" element={<AboutAuthor />} />
            <Route path="/app" element={<AboutApp />} />
          </Routes>
        </div>

        <Footer />
      </div>

      {selectedArtwork && (
        <Modal
          image={selectedArtwork?.image}
          title={selectedArtwork?.title}
          museum={selectedArtwork?.museum}
          currentIndex={selectedIndex}
          total={filteredArtworks.length}
          onClose={() => setSelectedIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </BrowserRouter>
  );
}

export default App;
