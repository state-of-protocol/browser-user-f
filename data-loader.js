/**
 * data-loader.js
 * ----------------------------------------------------------------------
 * Tanggungjawab tunggal: fetch JSON dari /assets dan return parsed object.
 * Tiada DOM manipulation di sini — itu kerja ui-manager.js.
 * Hanya guna Fetch API standard (tiada library luar).
 */

const ASSET_PATHS = {
  data: "assets/data.json",
  tokens: "assets/tokens.json",
};

/**
 * Fetch dan parse satu fail JSON.
 * @param {string} path - path relatif ke fail JSON
 * @returns {Promise<object>}
 * @throws {Error} jika fetch gagal atau response bukan JSON sah
 */
async function fetchJSON(path) {
  let response;
  try {
    response = await fetch(path, { cache: "no-cache" });
  } catch (networkError) {
    throw new Error(`Network error fetching "${path}": ${networkError.message}`);
  }

  if (!response.ok) {
    throw new Error(`Failed to load "${path}": HTTP ${response.status}`);
  }

  try {
    return await response.json();
  } catch (parseError) {
    throw new Error(`Invalid JSON in "${path}": ${parseError.message}`);
  }
}

/**
 * Load kandungan website (data.json).
 * @returns {Promise<object>}
 */
export function loadSiteData() {
  return fetchJSON(ASSET_PATHS.data);
}

/**
 * Load design tokens (tokens.json).
 * @returns {Promise<object>}
 */
export function loadTokens() {
  return fetchJSON(ASSET_PATHS.tokens);
}

/**
 * Load kedua-dua fail serentak.
 * @returns {Promise<{data: object, tokens: object}>}
 */
export async function loadAll() {
  const [data, tokens] = await Promise.all([loadSiteData(), loadTokens()]);
  return { data, tokens };
}
