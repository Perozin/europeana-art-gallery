// src/App.js
import { useState, useEffect } from "react";

import Header from "./components/Header/Header";
import SearchForm from "./components/SearchForm/SearchForm";
import Preloader from "./components/Preloader/Preloader";
import Gallery from "./components/Gallery/Gallery";

import { searchArtworks } from "./utils/europeanaApi";

function App() {

  const [artworks, setArtworks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
    art.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page">

      <Header />

      <SearchForm
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      {isLoading && <Preloader />}

      <Gallery artworks={filteredArtworks} />

    </div>
  );
}

export default App;