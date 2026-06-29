/**
 * main.js
 * ----------------------------------------------------------------------
 * Entry point. Tanggungjawab:
 *   1. Load data.json + tokens.json
 *   2. Apply tokens ke :root
 *   3. Render semua section
 *   4. Wire up event listeners yang tak spesifik kepada satu section
 *      (nav toggle, newsletter submit)
 *
 * Jika fetch gagal (contoh: dibuka terus dari file:// tanpa local server,
 * sebab CORS block fetch ke fail tempatan), papar mesej error yang jelas
 * dalam <main> supaya pengguna tahu sebab, bukan halaman kosong senyap.
 */

import { loadAll } from "./data-loader.js";
import { applyTokens } from "./token-loader.js";
import { renderAll } from "./ui-manager.js";

async function init() {
  try {
    const { data, tokens } = await loadAll();
    applyTokens(tokens);
    renderAll(data);
    wireNavToggle();
    wireNewsletterForm(data);
  } catch (error) {
    renderFatalError(error);
    // eslint-disable-next-line no-console
    console.error("[main.js] Failed to initialize site:", error);
  }
}

/**
 * Toggle mobile nav. Keyboard-accessible kerana guna <button> native
 * dengan aria-expanded, dan Escape menutup menu.
 */
function wireNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      toggle.focus();
    }
  });

  // Tutup menu bila link diklik (mobile UX)
  nav.addEventListener("click", (event) => {
    if (event.target.tagName === "A" && toggle.getAttribute("aria-expanded") === "true") {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }
  });
}

/**
 * Newsletter form: validate email dengan native Constraint Validation API
 * (tiada regex custom — guna built-in browser validation untuk elak
 * "hallucinated" validation logic yang tak standard).
 * @param {object} data - parsed data.json (untuk akses mesej error/success)
 */
function wireNewsletterForm(data) {
  const form = document.getElementById("newsletter-form");
  const input = document.getElementById("newsletter-email");
  const status = document.getElementById("newsletter-status");
  const submitBtn = document.getElementById("newsletter-submit");
  if (!form || !input || !status || !submitBtn) return;

  const { successMessage, errorMessage } = data.newsletter.form;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!input.checkValidity()) {
      status.textContent = errorMessage;
      status.dataset.state = "error";
      input.focus();
      return;
    }

    // Tiada backend sebenar (static site). Simulate submission state
    // supaya UX konsisten dengan spec SKILL.md (loading state required).
    submitBtn.classList.add("btn--loading");
    submitBtn.disabled = true;

    window.setTimeout(() => {
      submitBtn.classList.remove("btn--loading");
      submitBtn.disabled = false;
      status.textContent = successMessage;
      status.dataset.state = "success";
      form.reset();
    }, 600);
  });
}

/**
 * Papar mesej error yang jelas dalam <main> jika data gagal dimuatkan.
 * @param {Error} error
 */
function renderFatalError(error) {
  const main = document.getElementById("main-content");
  if (!main) return;

  main.replaceChildren();
  const wrapper = document.createElement("div");
  wrapper.className = "container";
  wrapper.style.paddingBlock = "var(--space-8)";

  const message = document.createElement("p");
  message.className = "load-error";
  message.textContent =
    "Site content failed to load. If you opened this file directly, " +
    "serve it through a local server (e.g. `python3 -m http.server`) " +
    "instead of opening index.html via file://, since fetch() is blocked " +
    "for local files by browser security policy.";

  wrapper.appendChild(message);
  main.appendChild(wrapper);
}

init();
