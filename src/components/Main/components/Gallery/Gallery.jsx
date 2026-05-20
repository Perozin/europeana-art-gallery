// src/components/Main/components/Gallery/Gallery.jsx

import "../../../../blocks/gallery.css";
import ArtCard from "../ArtCard/ArtCard";

function Gallery({ artworks, onImageClick }) {
  if (artworks.length === 0) {
    return <p className="gallery__empty">No artworks found</p>;
  }

  return (
    <section className="gallery">
      <ul className="gallery__list">
        {artworks.map((art, index) => (
          <ArtCard
            key={index}
            title={art.title}
            museum={art.museum}
            image={art.image}
            onImageClick={() => onImageClick(index)}
          />
        ))}
      </ul>
    </section>
  );
}

export default Gallery;
