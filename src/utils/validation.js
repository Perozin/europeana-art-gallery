// src/utils/validation.js

export function validateField(name, value, rule, t) {
  if (!rule) return "";

  // REQUIRED
  if (rule === "required") {
    if (!value || !value.trim()) {
      return t("required", { ns: "validation" });
    }
  }

  // NAME
  if (rule === "name") {
    if (!value || !value.trim()) {
      return t("nameRequired", { ns: "validation" });
    }

    if (value.trim().length < 2) {
      return t("minLength", { ns: "validation" });
    }
  }

  // SEARCH
  if (rule === "search") {
    if (!value || !value.trim()) {
      return t("required", { ns: "validation" });
    }

    if (value.trim().length < 2) {
      return t("minLength", { ns: "validation" });
    }
  }

  // DATE
  if (rule === "date") {
    if (!value) return "";

    const val = value.trim();

    // only accepts year
    const onlyYear = /^\d{4}$/;

    // accepts dd/mm/yyyy
    const brDate = /^\d{2}\/\d{2}\/\d{4}$/;

    // accepts yyyy-mm-dd
    const isoDate = /^\d{4}-\d{2}-\d{2}$/;

    const isValid =
      onlyYear.test(val) ||
      brDate.test(val) ||
      isoDate.test(val);

    if (!isValid) {
      return t("invalidDate", { ns: "validation" });
    }

    // validates future dates ONLY in ISO format.
    if (isoDate.test(val)) {
      const inputDate = new Date(val);
      const today = new Date();

      if (inputDate > today) {
        return t("futureDate", { ns: "validation" });
      }
    }
  }
  
  // IMAGE
  if (rule === "image") {
    if (!value) return "";

    const val = value.trim();

    // accept URL http/https
    const isURL =
      /^https?:\/\/.+/i.test(val);

    // accept base64
    const isBase64 =
      val.startsWith("data:image/");

    // accept caminhos locais
    const isRelativePath =
      /^\/|^\.\//.test(val);

    if (!isURL && !isBase64 && !isRelativePath) {
      return t("invalidImage", { ns: "validation" });
    }
  }

  return "";
}

