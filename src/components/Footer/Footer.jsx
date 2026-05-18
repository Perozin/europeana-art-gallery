// src/components/Footer/Footer.jsx
import "../../blocks/footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__left">
        <p>MarcioPerusin@ {year}</p>
      </div>

      <div className="footer__right">
        <p>Email: marcioperozin@gmail.com</p>

        <p>Social:</p>
        <a href="https://linkedin.com" target="_blank">
          LinkedIn
        </a>
        <a href="https://facebook.com" target="_blank">
          Facebook
        </a>
      </div>
    </footer>
  );
}

export default Footer;
