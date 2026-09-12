function readingTime() {
  const article = document.querySelector("article");
  const label = document.getElementById("readingTime");
  if (!article || !label) return;
  const text = article.innerText;
  const cjk = (text.match(/[\u3400-\u9fff\u3040-\u30ff]/g) || []).length;
  const words = text.replace(/[\u3400-\u9fff\u3040-\u30ff]/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const count = new Intl.NumberFormat(document.documentElement.lang).format(Math.max(1, Math.ceil(cjk / 500 + words / 225)));
  label.textContent = " · " + window.siteI18n.t("reading.minutes", { count });
}
document.addEventListener("DOMContentLoaded", readingTime);
