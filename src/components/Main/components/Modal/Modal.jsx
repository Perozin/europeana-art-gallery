// src/components/Main/components/Modal/Modal.jsx

import { useEffect } from "react";
import "../../../../blocks/modal.css";

function Modal({
  image,
  title,
  museum,
  currentIndex,
  total,
  onClose,
  onPrev,
  onNext,
}) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "ArrowRight") {
        onNext();
      }

      if (e.key === "ArrowLeft") {
        onPrev();
      }
    }

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose, onNext, onPrev]);

  if (!image) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <p className="modal__counter">
          {currentIndex + 1} / {total}
        </p>

        <button className="modal__close" onClick={onClose}>
          ✕
        </button>

        <div className="modal__image-container">
          <img className="modal__image" src={image} alt={title} />
        </div>

        <div className="modal__info">
          <h3 className="modal__title">{title}</h3>
          <p className="modal__museum">{museum}</p>
        </div>

        <button className="modal__arrow modal__arrow_left" onClick={onPrev}>
          ←
        </button>

        <button className="modal__arrow modal__arrow_right" onClick={onNext}>
          →
        </button>
      </div>
    </div>
  );
}

export default Modal;
