// src/components/Main/components/SearchForm/SearchForm.jsx

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useFormValidation } from "../../../../hooks/useFormValidation";

import "../../../../blocks/searchForm.css";
import "../../../../blocks/globalErrors.css";

function SearchForm({ searchQuery, setSearchQuery, onSearch }) {
  const { t, i18n } = useTranslation("search");

  const [isSearching, setIsSearching] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validateAll } =
    useFormValidation({ query: searchQuery }, { query: "search" }, t);

  useEffect(() => {
    if (touched.query) {
      validateAll();
    }
  }, [i18n.language]);

  const hasErrors = Object.keys(errors).length > 0;
  const isTooShort = !values.query || values.query.trim().length < 2;

  const isDisabled = hasErrors || isTooShort;

  function onInputChange(e) {
    handleChange(e);
    setSearchQuery(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateAll()) return;

    setIsSearching(true);

    const start = Date.now();

    try {
      await onSearch(values.query);
    } finally {
      const elapsed = Date.now() - start;
      const minTime = 500;

      setTimeout(
        () => {
          setIsSearching(false);
        },
        Math.max(0, minTime - elapsed),
      );
    }
  }

  return (
    <section className="search" id="search">
      <form className="search__form" onSubmit={handleSubmit}>
        <div className="search__content">
          <input
            name="query"
            value={values.query}
            onChange={(e) => {
              handleChange(e);
              setSearchQuery(e.target.value); // Keeps in sync with dad
            }}
            onBlur={handleBlur}
            className={`search__input ${
              errors.query && touched.query ? "input-error" : ""
            }`}
            placeholder={t("placeholder")}
          />

          {errors.query && touched.query && (
            <span className="input-error-message">{errors.query}</span>
          )}
        </div>

        <button
          className={`search__button ${
            isDisabled || isSearching ? "disabled" : ""
          }`}
          disabled={isDisabled || isSearching}
        >
          {isSearching ? t("searching") : t("button")}
        </button>
      </form>
    </section>
  );
}

export default SearchForm;
