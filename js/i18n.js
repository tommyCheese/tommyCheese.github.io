(function () {
  "use strict";

  const locales = ["zh-CN", "en", "ja", "ru", "zh-TW"];
  const locale = locales.includes(document.documentElement.lang)
    ? document.documentElement.lang : "zh-CN";
  const messages = window.SITE_MESSAGES || {};
  const prefix = locale === "zh-CN" ? "" : "/" + locale;

  function normalize(value) {
    const tag = String(value || "").toLowerCase();
    if (/^zh-(tw|hk|mo|hant)/.test(tag)) return "zh-TW";
    if (/^zh(?:-|$)/.test(tag)) return "zh-CN";
    return ["en", "ja", "ru"].find(code => tag === code || tag.startsWith(code + "-"));
  }

  function t(key, values = {}) {
    const value = messages[locale]?.[key] ?? messages["zh-CN"]?.[key] ?? key;
    return value.replace(/\{(\w+)\}/g, (match, name) => String(values[name] ?? match));
  }

  function link(value, target = locale) {
    const url = new URL(value, location.href);
    if (![location.origin, "https://tommycheese.github.io"].includes(url.origin)) return value;
    const path = url.pathname.replace(/^\/(en|ja|ru|zh-TW)(?=\/|$)/, "") || "/";
    url.pathname = (target === "zh-CN" ? "" : "/" + target) + path;
    return url.pathname + url.search + url.hash;
  }

  window.siteI18n = Object.freeze({ locale, prefix, t, link, normalize });

  // GitHub Pages serves the root 404 file for missing paths in every edition.
  if (document.documentElement.dataset?.pagePath === "/404.html") {
    const requested = location.pathname.match(/^\/(en|ja|ru|zh-TW)(?=\/|$)/)?.[1];
    if (requested && requested !== locale) {
      location.replace("/" + requested + "/404.html?from=" + encodeURIComponent(location.pathname));
      return;
    }
  }

  const languageLinks = document.querySelectorAll("[data-language]");
  function syncLinks() {
    languageLinks.forEach(anchor => {
      const url = new URL(anchor.href, location.href);
      url.hash = location.hash;
      url.search = location.search;
      anchor.href = url.pathname + url.search + url.hash;
    });
  }
  syncLinks();
  window.addEventListener("hashchange", syncLinks);
  languageLinks.forEach(anchor => {
    anchor.addEventListener("click", () => {
      syncLinks();
      try { localStorage.setItem("site-language", anchor.dataset.language); } catch (_) {}
    });
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") document.querySelectorAll(".language-switch[open]")
      .forEach(menu => { menu.open = false; menu.querySelector("summary").focus(); });
  });
  document.addEventListener("click", event => {
    document.querySelectorAll(".language-switch[open]").forEach(menu => {
      if (!menu.contains(event.target)) menu.open = false;
    });
  });

  // Explicit language URLs always win; only the unqualified home page negotiates.
  if (locale === "zh-CN" && ["/", "/index.html"].includes(location.pathname)) {
    let saved;
    try { saved = localStorage.getItem("site-language"); } catch (_) {}
    const preferred = locales.includes(saved) ? saved :
      (navigator.languages || [navigator.language]).map(normalize).find(Boolean);
    if (preferred && preferred !== locale) location.replace(link(location.href, preferred));
  }
})();
