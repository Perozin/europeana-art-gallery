// src/components/ArtCard/ArtCard.jsx
import "./ArtCard.css";

function ArtCard({ title, museum, image }) {
  return (
    <li className="card">
      <img
        className="card__image"
        src={image}
        alt={title}
      />

      <h3 className="card__title">{title}</h3>

      <p className="card__museum">{museum}</p>
    </li>
  );
}

export default ArtCard;