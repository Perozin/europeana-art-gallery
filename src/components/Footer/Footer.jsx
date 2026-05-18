// src/components/Footer/Footer.jsx

import { useTranslation } from "react-i18next";

import "../../blocks/footer.css";

import logo_white from "../../assets/images/logo-light.png";
import facebookIcon from "../../assets/images/facebook.svg";
import instagramIcon from "../../assets/images/instagram.svg";
import linkedinIcon from "../../assets/images/linkedin.svg";

function Footer() {
  const { t } = useTranslation("footer");

  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__circle"></div>

      <div className="footer__content">
        <div className="footer__logo">
          <img
            src={logo_white}
            alt={t("logoAlt")}
            className="footer__logo-image"
          />
        </div>

        <div className="footer__social">
          <div className="footer__social-heading">{t("social")}</div>

          <ul className="footer__list">
            <li className="footer__list-item footer__list-item_facebook">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
              >
                <img
                  src={facebookIcon}
                  alt={t("facebookAlt")}
                  className="footer__social-icon"
                />
                Facebook
              </a>
            </li>

            <li className="footer__list-item footer__list-item_instagram">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
              >
                <img
                  src={instagramIcon}
                  alt={t("instagramAlt")}
                  className="footer__social-icon"
                />
                Instagram
              </a>
            </li>

            <li className="footer__list-item footer__list-item_linkedin">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
              >
                <img
                  src={linkedinIcon}
                  alt={t("linkedinAlt")}
                  className="footer__social-icon"
                />
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__copyright">
        <p className="footer__copyright-text">
          &copy; <span> {year}</span> Marcio Perusin
        </p>
      </div>
    </footer>
  );
}

export default Footer;
