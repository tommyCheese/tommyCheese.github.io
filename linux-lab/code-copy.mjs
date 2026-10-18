// Keep the button outside the text being copied, including its final newline.
export function setupCodeCopy(doc, { selector = 'pre', translate = text => text } = {}) {
  if (!doc.getElementById('code-copy-style')) {
    const link = doc.createElement('link');
    link.id = 'code-copy-style'; link.rel = 'stylesheet';
    link.href = new URL('./code-copy.css', import.meta.url).href;
    doc.head.append(link);
  }
  function enhance() {
    for (const pre of doc.querySelectorAll(selector)) {
      if (pre.closest('.code-copy-block')) continue;
      const wrapper = doc.createElement('div'); wrapper.className = 'code-copy-block';
      const button = doc.createElement('button'); button.type = 'button'; button.className = 'code-copy-button';
      button.textContent = translate('复制'); button.setAttribute('aria-label', translate('复制代码块'));
      button.setAttribute('aria-live', 'polite');
      pre.replaceWith(wrapper); wrapper.append(pre, button);
      let timer;
      button.addEventListener('click', async () => {
        button.disabled = true;
        clearTimeout(timer);
        try {
          await doc.defaultView.navigator.clipboard.writeText(pre.textContent);
          button.textContent = translate('已复制');
        } catch {
          button.textContent = translate('复制失败');
        } finally {
          button.disabled = false;
          timer = setTimeout(() => { button.textContent = translate('复制'); }, 1800);
        }
      });
    }
  }
  enhance();
  const observer = new doc.defaultView.MutationObserver(enhance);
  observer.observe(doc.body, { childList:true, subtree:true });
  return () => observer.disconnect();
}
