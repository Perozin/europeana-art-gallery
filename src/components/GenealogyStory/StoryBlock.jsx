// src/components/GenealogyStory/StoryBlock.jsx

function StoryBlock({
  title,
  paragraphs,
  caption,
  image,
  alt,
  reverse = false,
}) {
  return (
    <div className={`story__block ${reverse ? "story__block--reverse" : ""}`}>
      <div className="story__text">
        <h2 className="story__subheading">{title}</h2>

        {paragraphs.map((paragraph, index) => (
          <p key={index} className="story__paragraph">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="story__image">
        <div className="story__content_img">
          <img className="story__img" src={image} alt={alt} />
        </div>

        <p className="story__caption">{caption}</p>
      </div>
    </div>
  );
}

export default StoryBlock;
