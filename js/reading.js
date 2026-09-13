// Native details remain usable without JavaScript; close after choosing a chapter.
document.querySelectorAll('.mobile-toc a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    link.closest('details').open = false;
    const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  });
});
