(function () {
  const container = document.getElementById('weather-alerts');
  const timestamp = document.getElementById('weather-timestamp');
  //const endpoint = 'https://api.met.no/weatherapi/metalerts/2.0/current.json';
  // Test with: 
  const endpoint = 'https://api.met.no/weatherapi/metalerts/2.0/test.json';

  function formatTime(date) {
    return date.toLocaleString('no-NO', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function renderAlert(alert, { typeIndex = 1, levelIndex = 1 } = {}) {
    const type = alert.properties.awareness_type || 'Varsel';
    const severity = alert.properties.severity || 'Ukjent';
    const level = alert.properties.level || 'Ukjent';
    const area = alert.properties.area || 'Ukjent område';
    const desc = alert.properties.description || '';

    // get the Nth part (1-based) from a raw string, sanitize and slugify it
    function getPart(raw, index) {
      if (!raw) return 'varsel';
      const str = String(raw);
      // split on common separators, trim and remove empty parts
      const parts = str.split(/[;:,\-\/]+/).map(p => p.trim()).filter(Boolean);
      // clamp to at least 1
      const i = Math.max(1, Math.floor(index));
      // pick requested part or fallback to last part
      let part = parts[i - 1] || parts[parts.length - 1] || str;
      // remove leading numbers and stray separators ("1 - wind" -> "wind")
      part = part.replace(/^[\d\s:;.\-–—]+/, '').trim();
      // extract trailing word-like token
      const m = part.match(/([A-Za-zÆØÅæøå0-9]+)$/);
      let token = m ? m[1] : part;
      // normalize, remove diacritics, make safe slug
      token = token.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return token.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'varsel';
    }

    // caller controls which part to use
    const iconName = getPart(type, 2);
    const iconColor = getPart(level, 2);
    const iconPath = `/beredskap/icons/icon-warning-${iconName}-${iconColor}.svg`;

    const div = document.createElement('div');
    div.className = 'alert-box';
    div.innerHTML = `
      <img src="${iconPath}" alt="${type}" class="alert-icon" />
      <div class="alert-text">
        <strong>${type}</strong> (${severity})<br />
        <em>${area}</em><br />
        ${desc}
      </div>
    `;
    container.appendChild(div);
  }

  function showError(msg) {
    container.innerHTML = `<p class="alert-error">🚫 Kunne ikke hente varsler: ${msg}</p>`;
  }

  function loadFromCache() {
    const cached = sessionStorage.getItem('metalerts');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        container.innerHTML = '';
        data.forEach(renderAlert);
        timestamp.textContent = `Viser lagrede varsler (${formatTime(new Date())})`;
      } catch {
        showError('Ugyldig cache');
      }
    } else {
      showError('Ingen lagrede varsler tilgjengelig');
    }
  }

  fetch(endpoint)
    .then(res => {
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return res.json();
    })
    .then(data => {
      const alerts = data.features;
      container.innerHTML = '';
      if (alerts.length === 0) {
        container.innerHTML = '<p>✅ Ingen aktive værvarsler akkurat nå.</p>';
      } else {
        alerts.forEach(renderAlert);
        sessionStorage.setItem('metalerts', JSON.stringify(alerts));
      }
      timestamp.textContent = `Sist hentet: ${formatTime(new Date())}`;
    })
    .catch(err => {
      showError(err.message);
      loadFromCache();
    });
})();
