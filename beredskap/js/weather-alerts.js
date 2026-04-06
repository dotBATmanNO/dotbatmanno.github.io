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
    const type = alert.properties.awareness_type.split(';');
    const severity = alert.properties.severity;
    const level = alert.properties.riskMatrixColor;
    const area = alert.properties.area;
    const desc = alert.properties.description;

    // caller controls which part to use
    const alerttype = type[1]?.trim().toLowerCase() || 'generic';
    const alertlevel = ['yellow', 'orange', 'red'].includes(level.toLowerCase())
      ? level.toLowerCase()
      : 'yellow';
    const iconPath = `/beredskap/icons/icon-warning-${alerttype}-${alertlevel}.svg`;
    const genericIconPath = `/beredskap/icons/icon-warning-generic-${alertlevel}.svg`;
    const fallbackIconPath = `/beredskap/icons/varsel.svg`;

    const div = document.createElement('div');
    div.className = 'alert-box';

    const img = document.createElement('img');
    img.src = iconPath;
    img.alt = type.join('; ');
    img.className = 'alert-icon';
    img.onerror = () => {
      if (img.src.endsWith(iconPath)) {
        img.onerror = null;
        img.src = genericIconPath;
      } else if (img.src.endsWith(genericIconPath)) {
        img.onerror = null;
        img.src = fallbackIconPath;
      } else {
        img.onerror = null;
      }
    };

    const text = document.createElement('div');
    text.className = 'alert-text';
    text.innerHTML = `
      <strong>${type.join('; ')}</strong> (${severity})<br />
      <em>${area}</em><br />
      ${desc}
    `;

    div.appendChild(img);
    div.appendChild(text);
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
      timestamp.textContent = `Sist hentet: ${formatTime(new Date())}. Hentet fra ${endpoint}`;
    })
    .catch(err => {
      showError(err.message);
      loadFromCache();
    });
})();
