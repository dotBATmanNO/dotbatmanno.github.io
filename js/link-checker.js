(function () {
  const isOffline = !navigator.onLine;

  // Select all elements with href or data-href
  const targets = document.querySelectorAll('a[href], button[data-href]');

  targets.forEach(el => {
    const url = el.tagName === 'A'
      ? el.getAttribute('href')
      : el.getAttribute('data-href');

    // Skip external links
    if (!url || url.startsWith('http') || url.startsWith('//')) return;

    // Offline mode: mark as uncertain
    if (isOffline) {
      el.classList.add('offline-mode');
      el.setAttribute('title', 'Offline — link may not work');
      return;
    }

    // Check existence via HEAD
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
