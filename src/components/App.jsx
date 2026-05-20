// src/components/App.js

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Navbar from "./Navbar/Navbar";
import ScrollToTop from "./ScrollToTop/ScrollToTop";
import Main from "./Main/Main";
import Modal from "./Main/components/Modal/Modal";

import About from "../pages/About";
import Contact from "../pages/Contact";
import Genealogy from "../pages/Genealogy";
import GenealogyStory from "../components/GenealogyStory/GenealogyStory";

function App() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [artworks, setArtworks] = useState([]);

  const selectedArtwork =
    selectedIndex !== null ? artworks[selectedIndex] : null;

  function handleNext() {
    setSelectedIndex((prev) => (prev < artworks.length - 1 ? prev + 1 : prev));
  }

  function handlePrev() {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="page">
        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <Main
                  onImageClick={setSelectedIndex}
                  artworks={artworks}
                  setArtworks={setArtworks}
                />
              </>
            }
          />

          {/* ABOUT */}
          <Route path="/author" element={<About />} />

          {/* CONTACT */}
          <Route path="/contact" element={<Contact />} />

          {/* GENEALOGY */}
          <Route path="/genealogy" element={<Genealogy />} />

          <Route path="/story" element={<GenealogyStory />} />
        </Routes>

        <Footer />

        {selectedArtwork && (
          <Modal
            image={selectedArtwork.image}
            title={selectedArtwork.title}
            museum={selectedArtwork.museum}
            currentIndex={selectedIndex}
            total={artworks.length}
            onClose={() => setSelectedIndex(null)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
