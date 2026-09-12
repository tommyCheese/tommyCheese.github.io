let searchRequest = 0;
let searchIndex;

async function searchOnChange(event) {
  const query = event.target.value.trim();
  const request = ++searchRequest;
  document.querySelectorAll('input[id="search"]').forEach(input => { input.value = event.target.value; });
  const container = document.getElementById("search-results");
  const panel = document.getElementById("search-content");
  container.replaceChildren();
  if (!query) { panel.style.display = "none"; return; }
  panel.style.display = "block";
  alignSearchContent();
  const { t, prefix, link } = window.siteI18n;
  function status(message) {
    const paragraph = document.createElement("p");
    paragraph.className = "text-center p-3";
    paragraph.setAttribute("role", "status");
    paragraph.textContent = message;
    container.replaceChildren(paragraph);
  }
  status(t("search.loading"));
  try {
    if (!searchIndex) {
      searchIndex = fetch(prefix + "/index.json").then(response => {
        if (!response.ok) throw new Error("Search index unavailable");
        return response.json();
      }).catch(error => { searchIndex = undefined; throw error; });
    }
    const entries = await searchIndex;
    if (request !== searchRequest) return;
    const needle = query.normalize("NFKC").toLocaleLowerCase(window.siteI18n.locale);
    const matches = entries.filter(item => [item.title, item.description, item.content]
      .some(value => String(value || "").normalize("NFKC").toLocaleLowerCase(window.siteI18n.locale).includes(needle)));
    container.replaceChildren();
    if (!matches.length) { status(t("search.noResults", { query })); return; }
    status(t("search.results", { count: matches.length }));
    matches.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      const anchor = document.createElement("a");
      anchor.href = link(item.permalink);
      anchor.className = "p-3";
      const heading = document.createElement("h5");
      heading.textContent = item.title;
      const description = document.createElement("div");
      description.textContent = item.description;
      anchor.append(heading, description);
      card.append(anchor);
      container.append(card);
    });
  } catch (_) {
    if (request === searchRequest) status(t("search.error"));
  }
}

function alignSearchContent() {
  const input = [...document.querySelectorAll('input[id="search"]')]
    .find(element => element.value && element.getClientRects().length);
  if (!input) return;
  const panel = document.getElementById("search-content");
  const rect = input.getBoundingClientRect();
  const width = Math.min(500, window.innerWidth - 24);
  panel.style.position = "fixed";
  panel.style.width = width + "px";
  panel.style.top = Math.min(rect.bottom + 8, window.innerHeight - 100) + "px";
  panel.style.left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)) + "px";
}

function resetSearch() {
  ++searchRequest;
  document.getElementById("search-content").style.display = "none";
  document.getElementById("search-results").replaceChildren();
  document.querySelectorAll('input[id="search"]').forEach(input => { input.value = ""; });
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") resetSearch();
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    let input = [...document.querySelectorAll('input[id="search"]')].find(element => element.getClientRects().length);
    if (!input) {
      document.getElementById("navbarContent").classList.add("show");
      input = [...document.querySelectorAll('input[id="search"]')].find(element => element.getClientRects().length);
    }
    input?.focus();
  }
});
document.addEventListener("click", event => {
  if (!event.target.closest('input[id="search"], #search-content')) resetSearch();
});
window.addEventListener("resize", alignSearchContent);
window.addEventListener("scroll", alignSearchContent, { passive: true });
