// src/components/Gallery/Gallery.jsx
import "./Gallery.css";
import ArtCard from "../ArtCard/ArtCard";

function Gallery({ artworks }) {
  if (artworks.length === 0) {
    return <p className="gallery__empty">No artworks found</p>;
  }

  return (
    <ul className="gallery">
      {artworks.map((art, index) => (
        <ArtCard
          key={index}
          title={art.title}
          museum={art.museum}
          image={art.image}
        />
      ))}
    </ul>
  );
}

export default Gallery;
