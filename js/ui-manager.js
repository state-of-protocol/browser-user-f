/**
 * ui-manager.js
 * ----------------------------------------------------------------------
 * Tanggungjawab tunggal: terima data (sudah di-fetch) dan render ke DOM.
 * Setiap fungsi render*() bertanggungjawab untuk SATU section sahaja.
 * Semua fungsi idempotent — boleh dipanggil semula tanpa duplicate DOM.
 */

/** Utiliti kecil untuk create element + set attributes/text ringkas. */
function el(tag, { className, text, html, attrs } = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  if (html !== undefined) node.innerHTML = html;
  if (attrs) {
    for (const [key, val] of Object.entries(attrs)) {
      node.setAttribute(key, val);
    }
  }
  return node;
}

function clear(node) {
  if (node) node.replaceChildren();
}

/* ============================================================
   NAV
   ============================================================ */

export function renderNav(data) {
  const logo = document.getElementById("logo");
  if (logo) logo.textContent = data.nav.logo.text;

  const list = document.getElementById("primary-nav-list");
  if (list) {
    clear(list);
    for (const link of data.nav.links) {
      const li = el("li");
      const a = el("a", { text: link.label, attrs: { href: link.href, id: link.id } });
      li.appendChild(a);
      list.appendChild(li);
    }
  }

  const actions = document.getElementById("site-header-actions");
  if (actions) {
    clear(actions);
    const secondary = el("a", {
      className: "btn btn--ghost",
      text: data.nav.secondaryCta.label,
      attrs: { href: data.nav.secondaryCta.href, id: data.nav.secondaryCta.id },
    });
    const primary = el("a", {
      className: "btn btn--primary",
      text: data.nav.cta.label,
      attrs: { href: data.nav.cta.href, id: data.nav.cta.id },
    });
    actions.append(secondary, primary);
  }
}

/* ============================================================
   HERO
   ============================================================ */

export function renderHero(data) {
  const { hero } = data;

  setText("hero-eyebrow", hero.eyebrow);
  setText("hero-heading", hero.headline);
  setText("hero-sub", hero.subheadline);

  const actions = document.getElementById("hero-actions");
  if (actions) {
    clear(actions);
    actions.append(
      el("a", { className: "btn btn--primary", text: hero.primaryCta.label, attrs: { href: hero.primaryCta.href, id: hero.primaryCta.id } }),
      el("a", { className: "btn btn--ghost", text: hero.secondaryCta.label, attrs: { href: hero.secondaryCta.href, id: hero.secondaryCta.id } })
    );
  }

  const stats = document.getElementById("hero-stats");
  if (stats) {
    clear(stats);
    for (const stat of hero.stats) {
      const wrapper = el("div", { className: "hero__stat", attrs: { id: stat.id } });
      wrapper.append(
        el("dt", { text: stat.value }),
        el("dd", { text: stat.label })
      );
      stats.appendChild(wrapper);
    }
  }
}

/* ============================================================
   FEATURES
   ============================================================ */

export function renderFeatures(data) {
  const { features } = data;
  setText("features-heading", features.heading);
  setText("features-sub", features.subheading);

  const grid = document.getElementById("features-grid");
  if (!grid) return;
  clear(grid);

  for (const item of features.items) {
    const card = el("li", { className: "feature-card", attrs: { id: item.id } });
    card.append(
      el("div", { className: "feature-card__icon", attrs: { "aria-hidden": "true" }, text: iconGlyph(item.icon) }),
      el("h3", { className: "feature-card__title", text: item.title }),
      el("p", { className: "feature-card__desc", text: item.description })
    );
    grid.appendChild(card);
  }
}

/* ============================================================
   USE CASES
   ============================================================ */

export function renderUseCases(data) {
  const { useCases } = data;
  setText("use-cases-heading", useCases.heading);
  setText("use-cases-sub", useCases.subheading);

  const grid = document.getElementById("use-cases-grid");
  if (!grid) return;
  clear(grid);

  for (const item of useCases.items) {
    const card = el("li", { className: "use-case-card", attrs: { id: item.id } });
    card.append(
      el("h3", { className: "use-case-card__title", text: item.title }),
      el("p", { className: "use-case-card__desc", text: item.description })
    );
    grid.appendChild(card);
  }
}

/* ============================================================
   DOCS
   ============================================================ */

export function renderDocs(data) {
  const { docs } = data;
  setText("docs-heading", docs.heading);
  setText("docs-sub", docs.subheading);

  const grid = document.getElementById("docs-grid");
  if (!grid) return;
  clear(grid);

  for (const link of docs.links) {
    const card = el("li", {});
    const a = el("a", { className: "doc-card", attrs: { href: link.href, id: link.id } });
    a.append(
      el("h3", { className: "doc-card__title", text: link.title }),
      el("p", { className: "doc-card__desc", text: link.description })
    );
    card.appendChild(a);
    grid.appendChild(card);
  }
}

/* ============================================================
   PRICING
   ============================================================ */

export function renderPricing(data) {
  const { pricing } = data;
  setText("pricing-heading", pricing.heading);
  setText("pricing-sub", pricing.subheading);

  const grid = document.getElementById("pricing-grid");
  if (!grid) return;
  clear(grid);

  for (const plan of pricing.plans) {
    const cardClass = plan.highlighted ? "pricing-card pricing-card--highlighted" : "pricing-card";
    const card = el("li", { className: cardClass, attrs: { id: plan.id } });

    const priceRow = el("div", { className: "pricing-card__price" });
    priceRow.append(
      el("span", { className: "pricing-card__price-value", text: plan.price }),
      el("span", { className: "pricing-card__price-period", text: plan.period })
    );

    const featureList = el("ul", { className: "pricing-card__features" });
    for (const feature of plan.features) {
      featureList.appendChild(el("li", { text: feature }));
    }

    card.append(
      el("h3", { className: "pricing-card__name", text: plan.name }),
      priceRow,
      el("p", { className: "pricing-card__desc", text: plan.description }),
      featureList,
      el("a", { className: "btn btn--primary", text: plan.cta.label, attrs: { href: plan.cta.href } })
    );

    grid.appendChild(card);
  }
}

/* ============================================================
   TESTIMONIALS
   ============================================================ */

export function renderTestimonials(data) {
  const { testimonials } = data;
  setText("testimonials-heading", testimonials.heading);

  const grid = document.getElementById("testimonials-grid");
  if (!grid) return;
  clear(grid);

  for (const item of testimonials.items) {
    const card = el("li", { className: "testimonial-card", attrs: { id: item.id } });
    card.append(
      el("p", { className: "testimonial-card__quote", text: `“${item.quote}”` }),
      el("p", { className: "testimonial-card__author", text: item.author }),
      el("p", { className: "testimonial-card__role", text: item.role })
    );
    grid.appendChild(card);
  }
}

/* ============================================================
   FAQ (accordion — keyboard + click)
   ============================================================ */

export function renderFAQ(data) {
  const { faq } = data;
  setText("faq-heading", faq.heading);

  const list = document.getElementById("faq-list");
  if (!list) return;
  clear(list);

  for (const item of faq.items) {
    const wrapper = el("div", { className: "faq-item", attrs: { id: item.id } });

    const questionId = `${item.id}-question`;
    const answerId = `${item.id}-answer`;

    const button = el("button", {
      className: "faq-item__question",
      attrs: {
        id: questionId,
        type: "button",
        "aria-expanded": "false",
        "aria-controls": answerId,
      },
    });
    button.append(
      el("span", { text: item.question }),
      el("span", { className: "faq-item__icon", attrs: { "aria-hidden": "true" }, text: "+" })
    );

    const answer = el("div", {
      className: "faq-item__answer",
      attrs: { id: answerId, role: "region", "aria-labelledby": questionId },
    });
    const answerInner = el("div", { className: "faq-item__answer-inner", text: item.answer });
    answer.appendChild(answerInner);

    button.addEventListener("click", () => toggleFAQItem(button, answer));

    wrapper.append(button, answer);
    list.appendChild(wrapper);
  }
}

function toggleFAQItem(button, answer) {
  const isOpen = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!isOpen));
  answer.style.maxHeight = isOpen ? null : `${answer.scrollHeight}px`;
}

/* ============================================================
   NEWSLETTER
   ============================================================ */

export function renderNewsletter(data) {
  const { newsletter } = data;
  setText("newsletter-heading", newsletter.heading);
  setText("newsletter-sub", newsletter.subheading);
  setText("newsletter-submit", newsletter.form.submitLabel);

  const input = document.getElementById("newsletter-email");
  if (input) input.placeholder = newsletter.form.placeholder;

  // Simpan mesej supaya boleh dirujuk semasa submit (main.js attach handler submit)
  const form = document.getElementById("newsletter-form");
  if (form) {
    form.dataset.successMessage = newsletter.form.successMessage;
    form.dataset.errorMessage = newsletter.form.errorMessage;
  }
}

/* ============================================================
   FINAL CTA
   ============================================================ */

export function renderCTA(data) {
  const { cta } = data;
  setText("cta-heading", cta.heading);
  setText("cta-sub", cta.subheading);

  const actions = document.getElementById("cta-actions");
  if (actions) {
    clear(actions);
    actions.append(
      el("a", { className: "btn btn--primary", text: cta.primaryCta.label, attrs: { href: cta.primaryCta.href } }),
      el("a", { className: "btn btn--ghost", text: cta.secondaryCta.label, attrs: { href: cta.secondaryCta.href } })
    );
  }
}

/* ============================================================
   FOOTER
   ============================================================ */

export function renderFooter(data) {
  const { footer } = data;

  const grid = document.getElementById("site-footer-grid");
  if (grid) {
    clear(grid);
    for (const column of footer.columns) {
      const colWrapper = el("div", { attrs: { id: column.id } });
      const list = el("ul", { className: "footer-col__list" });
      for (const link of column.links) {
        const li = el("li");
        li.appendChild(el("a", { text: link.label, attrs: { href: link.href } }));
        list.appendChild(li);
      }
      colWrapper.append(
        el("h3", { className: "footer-col__title", text: column.title }),
        list
      );
      grid.appendChild(colWrapper);
    }
  }

  setText("site-footer-copyright", footer.copyright);

  const social = document.getElementById("site-footer-social");
  if (social) {
    clear(social);
    for (const item of footer.social) {
      const li = el("li");
      li.appendChild(el("a", { text: item.label, attrs: { href: item.href, id: item.id } }));
      social.appendChild(li);
    }
  }
}

/* ============================================================
   ORCHESTRATOR
   ============================================================ */

/**
 * Render semua section. Dipanggil sekali oleh main.js selepas data loaded.
 * @param {object} data - parsed data.json
 */
export function renderAll(data) {
  renderNav(data);
  renderHero(data);
  renderFeatures(data);
  renderUseCases(data);
  renderDocs(data);
  renderPricing(data);
  renderTestimonials(data);
  renderFAQ(data);
  renderNewsletter(data);
  renderCTA(data);
  renderFooter(data);
}

/* ============================================================
   HELPERS
   ============================================================ */

function setText(id, text) {
  const node = document.getElementById(id);
  if (node) node.textContent = text;
}

/**
 * Map nama icon (string) kepada glyph ringkas. Tiada icon library luar
 * digunakan (no-hallucination: tiada dependency yang tak disahkan wujud).
 * Jika perlukan SVG icon sebenar, gantikan map ini dengan inline <svg>.
 */
function iconGlyph(name) {
  const glyphs = {
    bolt: "⚡",
    "shield-check": "🛡",
    lock: "🔒",
    puzzle: "🧩",
    activity: "📈",
    code: "{ }",
  };
  return glyphs[name] ?? "•";
}
