// src/components/SearchForm.jsx
import "./SearchForm.css";

function SearchForm({ searchQuery, setSearchQuery, onSearch }) {
  function handleChange(e) {
    setSearchQuery(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(searchQuery);
  }

  return (
    <section className="search">
      <form className="search__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search__input"
          placeholder="Search for an artist or artwork..."
          value={searchQuery}
          onChange={handleChange}
        />

        <button className="search__button">Search</button>
      </form>
    </section>
  );
}

export default SearchForm;
