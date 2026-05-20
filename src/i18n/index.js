// src/i18n/index.js

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import navbar_en from "./locales/en/navbar.json";
import header_en from "./locales/en/header.json";
import search_en from "./locales/en/search.json";
import about_en from "./locales/en/about.json";
import contact_en from "./locales/en/contact.json";
import genealogy_en from "./locales/en/genealogy.json";
import genealogyTreeD3_en from "./locales/en/genealogyTreeD3.json";
import genealogyStory_en from "./locales/en/genealogyStory.json";
import footer_en from "./locales/en/footer.json";
import validation_en from "./locales/en/validation.json";
import main_en from "./locales/en/main.json";

import navbar_pt from "./locales/pt/navbar.json";
import header_pt from "./locales/pt/header.json";
import search_pt from "./locales/pt/search.json";
import about_pt from "./locales/pt/about.json";
import contact_pt from "./locales/pt/contact.json";
import genealogy_pt from "./locales/pt/genealogy.json";
import genealogyTreeD3_pt from "./locales/pt/genealogyTreeD3.json";
import genealogyStory_pt from "./locales/pt/genealogyStory.json";
import footer_pt from "./locales/pt/footer.json";
import validation_pt from "./locales/pt/validation.json";
import main_pt from "./locales/pt/main.json";

import navbar_it from "./locales/it/navbar.json";
import header_it from "./locales/it/header.json";
import search_it from "./locales/it/search.json";
import about_it from "./locales/it/about.json";
import contact_it from "./locales/it/contact.json";
import genealogy_it from "./locales/it/genealogy.json";
import genealogyTreeD3_it from "./locales/it/genealogyTreeD3.json";
import genealogyStory_it from "./locales/it/genealogyStory.json";
import footer_it from "./locales/it/footer.json";
import validation_it from "./locales/it/validation.json";
import main_it from "./locales/it/main.json";

import navbar_de from "./locales/de/navbar.json";
import header_de from "./locales/de/header.json";
import search_de from "./locales/de/search.json";
import about_de from "./locales/de/about.json";
import contact_de from "./locales/de/contact.json";
import genealogy_de from "./locales/de/genealogy.json";
import genealogyTreeD3_de from "./locales/de/genealogyTreeD3.json";
import genealogyStory_de from "./locales/de/genealogyStory.json";
import footer_de from "./locales/de/footer.json";
import validation_de from "./locales/de/validation.json";
import main_de from "./locales/de/main.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      navbar: navbar_en,
      header: header_en,
      search: search_en,
      about: about_en,
      contact: contact_en,
      genealogy: genealogy_en,
      genealogyTreeD3: genealogyTreeD3_en,
      genealogyStory: genealogyStory_en,
      footer: footer_en,
      validation: validation_en,
      main: main_en,
    },

    pt: {
      navbar: navbar_pt,
      header: header_pt,
      search: search_pt,
      about: about_pt,
      contact: contact_pt,
      genealogy: genealogy_pt,
      genealogyTreeD3: genealogyTreeD3_pt,
      genealogyStory: genealogyStory_pt,
      footer: footer_pt,
      validation: validation_pt,
      main: main_pt,
    },

    it: {
      navbar: navbar_it,
      header: header_it,
      search: search_it,
      about: about_it,
      contact: contact_it,
      genealogy: genealogy_it,
      genealogyTreeD3: genealogyTreeD3_it,
      genealogyStory: genealogyStory_it,
      footer: footer_it,
      validation: validation_it,
      main: main_it,
    },

    de: {
      navbar: navbar_de,
      header: header_de,
      search: search_de,
      about: about_de,
      contact: contact_de,
      genealogy: genealogy_de,
      genealogyTreeD3: genealogyTreeD3_de,
      genealogyStory: genealogyStory_de,
      footer: footer_de,
      validation: validation_de,
      main: main_de,
    },
  },

  ns: [
    "navbar",
    "header",
    "main",
    "search",
    "about",
    "contact",
    "genealogy",
    "genealogyTreeD3",
    "genealogyStory",
    "footer",
    "validation",    
  ],

  defaultNS: "navbar",

  lng: "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

