/**
 * token-loader.js
 * ----------------------------------------------------------------------
 * Tukar struktur tokens.json (nested object) kepada flat CSS custom
 * properties dan inject ke :root. style.css sudah ada fallback values
 * yang sama, jadi jika fetch gagal, site masih nampak betul (degrades
 * gracefully) — ini bukan dependency kritikal.
 */

/**
 * Flatten nested object kepada array [cssVarName, value].
 * Contoh: { color: { text: { primary: "#fff" } } }
 *      -> ["--color-text-primary", "#fff"]
 * @param {object} obj
 * @param {string[]} pathParts
 * @returns {Array<[string, string]>}
 */
function flattenTokens(obj, pathParts = []) {
  const entries = [];

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("_")) continue; // skip _meta dsb.

    const nextPath = [...pathParts, key];

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      entries.push(...flattenTokens(value, nextPath));
    } else {
      const cssVarName = `--${nextPath.join("-")}`;
      entries.push([cssVarName, String(value)]);
    }
  }

  return entries;
}

/**
 * Apply semua token sebagai CSS custom properties pada :root.
 * @param {object} tokens - parsed tokens.json
 */
export function applyTokens(tokens) {
  if (!tokens || typeof tokens !== "object") return;

  const root = document.documentElement;
  const flatEntries = flattenTokens(tokens);

  for (const [cssVarName, value] of flatEntries) {
    root.style.setProperty(cssVarName, value);
  }
}
