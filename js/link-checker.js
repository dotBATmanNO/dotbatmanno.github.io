(function () {
  const targets = document.querySelectorAll('a[href], button[data-href]');

  targets.forEach(el => {
    const url = el.tagName === 'A'
      ? el.getAttribute('href')
      : el.getAttribute('data-href');

    // Skip external links
    if (!url || url.startsWith('http') || url.startsWith('//')) return;

    // Offline mode: check cache
    if (!navigator.onLine && 'caches' in window) {
      caches.match(url).then(match => {
        if (!match) {
          el.classList.add('unavailable');
          el.setAttribute('title', '🚫 Not available offline');
          const label = document.createElement('span');
          label.className = 'link-note';
          label.textContent = ' (not cached)';
          el.appendChild(label);
        } else {
          el.classList.add('offline-mode');
          el.setAttribute('title', '✅ Available offline');
        }
      });
      return;
    }

    // Online mode: check via HEAD
    fetch(url, { method: 'HEAD' })
      .then(res => {
        if (!res.ok) throw new Error('Missing');
      })
      .catch(() => {
        el.classList.add('unavailable');
        el.setAttribute('title', '🚫 Page not available');
        const label = document.createElement('span');
        label.className = 'link-note';
        label.textContent = ' (not available)';
        el.appendChild(label);
      });
  });
})();
