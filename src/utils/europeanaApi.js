// src/utils/europeanaApi.js

const API_KEY = "lvollbasmal";

export function searchArtworks(query) {

  const url = `https://api.europeana.eu/record/v2/search.json?query=${query}&wskey=${API_KEY}&rows=12&media=true&qf=TYPE:IMAGE`;

  return fetch(url)
    .then((res) => res.json())
    .then((data) => {

      return data.items.map((item) => ({
        title: item.title?.[0] || "Untitled",
        museum: item.dataProvider?.[0] || "Unknown museum",
        image: item.edmPreview?.[0] || ""
      }));

    });

}