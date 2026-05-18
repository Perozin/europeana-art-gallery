// src/utils/storage.js

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
  // 1. new key tent
  let data = localStorage.getItem(KEY);

  if (data) {
    const parsed = JSON.parse(data);

    // ================= AUTO MIGRATION =================
    const migrated = migrateRelations(parsed);

    // saved already migrated
    localStorage.setItem(KEY, JSON.stringify(migrated));

    return migrated;
  }

  // 2. try old keys
  for (const oldKey of OLD_KEYS) {
    const oldData = localStorage.getItem(oldKey);

    if (oldData) {
      const parsed = JSON.parse(oldData);

      // ================= AUTO MIGRATION =================
      const migrated = migrateRelations(parsed);

      // automatically migrates to a new key.
      localStorage.setItem(KEY, JSON.stringify(migrated));

      console.log("🔄 Dados migrados de:", oldKey);

      return migrated;
    }
  }

  return null;
}

/* ================= SAVE DATA ================= */

export function saveFamilyData(data) {
  if (!data || Object.keys(data).length === 0) {
    console.warn("⚠️ Tentativa de salvar dados vazios ignorada");
    return;
  }

  localStorage.setItem(KEY, JSON.stringify(data));
}

