// src/components/Main/components/Gallery/Gallery.jsx
import "../../../../blocks/gallery.css";
import ArtCard from "../ArtCard/ArtCard";
// import GalleryImage from "../../assets/images/bkg_rcp.svg";

function Gallery({ artworks, onImageClick }) {
  if (artworks.length === 0) {
    return <p className="gallery__empty">No artworks found</p>;
  }

  return (
    <section className="gallery">
      {/* <img
        src={GalleryImage}
        alt="background image "
        className="gallery_image"
      /> */}

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

// import "./Gallery.css";
// import ArtCard from "../ArtCard/ArtCard";

// function Gallery({ artworks, onImageClick }) {
//   if (artworks.length === 0) {
//     return <p className="gallery__empty">No artworks found</p>;
//   }

//   return (
//     <ul className="gallery">
//       {artworks.map((art, index) => (
//         <ArtCard
//           key={index}
//           title={art.title}
//           museum={art.museum}
//           image={art.image}
//           onImageClick={() => onImageClick(index)}
//         />
//       ))}
//     </ul>
//   );
// }

// export default Gallery;
