const countryData = {
    IN: { name: 'India', capital: 'New Delhi', flag: '🇮🇳', region: 'South Asia', population: '1.4 Billion', currency: 'Indian Rupee (₹)' },
    JP: { name: 'Japan', capital: 'Tokyo', flag: '🇯🇵', region: 'East Asia', population: '125 Million', currency: 'Japanese Yen (¥)' },
    FR: { name: 'France', capital: 'Paris', flag: '🇫🇷', region: 'Western Europe', population: '67 Million', currency: 'Euro (€)' },
    BR: { name: 'Brazil', capital: 'Brasília', flag: '🇧🇷', region: 'South America', population: '214 Million', currency: 'Brazilian Real (R$)' },
    AU: { name: 'Australia', capital: 'Canberra', flag: '🇦🇺', region: 'Oceania', population: '26 Million', currency: 'Australian Dollar (A$)' }
};

// ── Show Capital (event-driven, updates dynamically) ──────────
function showCapital() {
    const code = document.getElementById('countryDrop').value;
    const card = document.getElementById('capitalCard');
    const empty = document.getElementById('emptyState');

    if (!code) {
        card.classList.add('hidden');
        empty.classList.remove('hidden');
        return;
    }

    const data = countryData[code];
    empty.classList.add('hidden');

    // Update DOM dynamically using JavaScript
    document.getElementById('flagDisplay').textContent = data.flag;
    document.getElementById('countryLabel').textContent = data.name;
    document.getElementById('capitalName').textContent = data.capital;
    document.getElementById('extraInfo').innerHTML = `
        <span class="info-chip">🌐 ${data.region}</span>
        <span class="info-chip">👥 ${data.population}</span>
        <span class="info-chip">💱 ${data.currency}</span>
    `;

    card.classList.remove('hidden');
}

// ── Click card in grid → select in dropdown ───────────────────
function selectCountry(code) {
    document.getElementById('countryDrop').value = code;
    showCapital();
    document.getElementById('capitalCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
}
