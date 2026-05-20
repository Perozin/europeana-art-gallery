  // src/utils/storage.js

  import defaultTree from "../data/defaultTree.json";

  const KEY = "genealogy-data";
  const OLD_KEYS = ["familyData", "genealogy", "treeData"];

  /* ================= RELATION MIGRATION ================= */
  /*
    Converts old relationships saved as text into semantic keys compatible with i18n.
  */

  const relationMigration = {
    // Portuguese
    Hexavô: "hexagreatGrandfather",

    // English
    "Hexagreat-grandfather": "hexagreatGrandfather",

    // Italian
    Esanonno: "hexagreatGrandfather",

    // German
    Urururururgroßvater: "hexagreatGrandfather",
  };

  /* ================= MIGRATION FUNCTION ================= */

  function migrateRelations(person) {
    if (!person) return person;

    // Update current relationship
    if (person.relation && relationMigration[person.relation]) {
      person.relation = relationMigration[person.relation];
    }

    // Update children recursively.
    if (person.children && Array.isArray(person.children)) {
      person.children = person.children.map((child) =>
        migrateRelations(child),
      );
    }

    return person;
  }

  /* ================= GET DATA ================= */

  export function getFamilyData() {
    let data = localStorage.getItem(KEY);

    if (data) {
      const parsed = JSON.parse(data);
      const migrated = migrateRelations(parsed);

      localStorage.setItem(KEY, JSON.stringify(migrated));
      return migrated;
    }

    // fallback
    const migratedDefault = migrateRelations(defaultTree);

    localStorage.setItem(KEY, JSON.stringify(migratedDefault));

    return migratedDefault;
  }

  /* ================= SAVE DATA ================= */

  export function saveFamilyData(data) {
    if (!data || Object.keys(data).length === 0) {
      console.warn("⚠️ Attempt to save empty data ignored.");
      return;
    }

    localStorage.setItem(KEY, JSON.stringify(data));
  }




