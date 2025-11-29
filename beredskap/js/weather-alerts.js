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

  function renderAlert(alert) {
    const type = alert.properties.awareness_type || 'Varsel';
    const severity = alert.properties.severity || 'Ukjent';
    const level = alert.properties.level || 'Ukjent';
    const area = alert.properties.area || 'Ukjent område';
    const desc = alert.properties.description || '';

    // sanitize and extract the meaningful part for the icon filename
    function slugifyIconName(raw) {
      if (!raw) return 'varsel';
      // split on common separators and take the last segment
      let segment = String(raw).split(/[:;,-]/).pop().trim();
      // take the last word made of letters/numbers (handles "1;-wind" => "wind")
      const m = segment.match(/([A-Za-zÆØÅæøå0-9]+)$/);
      const word = m ? m[1] : segment;
      return word.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const iconName = slugifyIconName(type);
    const iconColor = slugifyIconName(level);
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
