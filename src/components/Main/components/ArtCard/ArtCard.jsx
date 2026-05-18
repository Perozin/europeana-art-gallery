// src/components/Main/components/ArtCard/ArtCard.jsx
import { useState } from "react";
import "../../../../blocks/artCard.css";

function ArtCard({ title, museum, image, onImageClick }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <li className="card">
      <div className="card__image-wrapper">
        {!loaded && <div className="card__skeleton"></div>}

        <img
          className={`card__image ${loaded ? "loaded" : ""}`}
          src={image}
          alt={title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onClick={onImageClick}
        />
      </div>

      <h3 className="card__title">{title}</h3>
      <p className="card__museum">{museum}</p>
    </li>
  );
}

export default ArtCard;
