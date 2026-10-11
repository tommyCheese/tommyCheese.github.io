import { lessons } from './curriculum.mjs';
const KEY = 'tommy-cheese-linux-lab-v1';
function readSaved() {
  try { const data = JSON.parse(localStorage.getItem(KEY) || '{}'); return data && typeof data === 'object' && !Array.isArray(data) ? data : {}; }
  catch { return {}; }
}
const lessonIds = new Set(lessons.map(item => item.id));
const root = new URL('./', import.meta.url);
function updateReturnLink() {
  let route;
  try { route = localStorage.getItem('learn-linux-last-route'); } catch {}
  if (route !== 'sandbox' && route !== 'review' && !(/^(task|starter|review|quiz)\//.test(route || '') && lessonIds.has(route.split('/')[1]))) {
    const current = readSaved().current;
    route = 'task/' + (lessonIds.has(current) ? current : lessons[0].id);
  }
  for (const link of document.querySelectorAll('[data-return-practice]')) link.href = root.href + '#' + route;
}
function favoriteNames() { const list = readSaved().favorites; return new Set(Array.isArray(list) ? list : []); }
const filters = document.getElementById('reference-filters');
function filterCommands() {
  if (!filters) return;
  const query = document.getElementById('reference-search').value.trim().toLowerCase();
  const level = document.getElementById('reference-level').value;
  const category = document.getElementById('reference-category').value;
  const onlyFavorites = document.getElementById('reference-favorites').checked;
  const favorites = favoriteNames();
  let count = 0;
  for (const item of document.querySelectorAll('#content [data-command]')) {
    item.hidden = !((!query || item.dataset.search.toLowerCase().includes(query)) && (!level || item.dataset.level === level) && (!category || item.dataset.category === category) && (!onlyFavorites || favorites.has(item.dataset.command)));
    if (!item.hidden) count++;
  }
  for (const section of document.querySelectorAll('#content > section')) section.hidden = !section.querySelector('[data-command]:not([hidden])');
  const result = document.getElementById('reference-results');
  result.hidden = false;
  result.textContent = count ? count + ' 条命令' : '没有匹配的命令。';
}
function updateFavoriteButtons() {
  const favorites = favoriteNames();
  for (const button of document.querySelectorAll('[data-favorite]')) {
    const selected = favorites.has(button.dataset.favorite);
    button.hidden = false;
    button.setAttribute('aria-pressed', String(selected));
    button.textContent = selected ? '★ 已收藏' : '☆ 收藏';
  }
}
for (const button of document.querySelectorAll('[data-favorite]')) button.addEventListener('click', () => {
  const data = readSaved(); const favorites = favoriteNames(); const name = button.dataset.favorite;
  if (favorites.has(name)) favorites.delete(name); else favorites.add(name);
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...data, favorites: [...favorites] }));
    document.getElementById('favorite-status').textContent = favorites.has(name) ? '已收藏' : '已取消收藏';
    updateFavoriteButtons();
  } catch { document.getElementById('favorite-status').textContent = '无法保存收藏，请检查浏览器存储设置。'; }
});
if (filters) {
  filters.hidden = false;
  filters.addEventListener('submit', event => event.preventDefault());
  filters.addEventListener('input', filterCommands);
  filters.addEventListener('change', filterCommands);
  filterCommands();
}
window.addEventListener('storage', () => { updateReturnLink(); updateFavoriteButtons(); filterCommands(); });
updateReturnLink(); updateFavoriteButtons();
// Reapply filters after the browser restores form values on Back/Forward.
window.addEventListener('pageshow', () => { updateReturnLink(); updateFavoriteButtons(); filterCommands(); });
