// src/pages/Contact.jsx

import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar/Navbar";

import "../blocks/contact.css";

export default function Contact() {
  const { t } = useTranslation("contact");

  return (
    <>
      <section className="contact">
        {/* NAV */}
        <Navbar />

        <h2 className="contact__title">{t("title")}</h2>

        <p className="contact__paragraph">{t("paragraph")}</p>

        <p className="contact__email">
          {t("email")}
          <a href="mailto:marcioperozin@gmail.com"> marcioperozin@gmail.com</a>
        </p>
      </section>
    </>
  );
}
