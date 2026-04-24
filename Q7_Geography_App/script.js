let currentRegion = 'all';
let quizScore = 0;
let quizTotal = 0;
let quizQuestion = null;

// ── Populate Dropdown ────────────────────────────────────────
function populateDropdown(list) {
    const sel = document.getElementById('countrySelect');
    sel.innerHTML = list.map(c =>
        `<option value="${c.code}">${c.flag} ${c.name}</option>`
    ).join('');
}

// ── Filter by search input ───────────────────────────────────
function filterCountries() {
    const q = document.getElementById('searchCountry').value.toLowerCase();
    const filtered = COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q)
    );
    populateDropdown(filtered);
}

// ── Display Country Info ─────────────────────────────────────
function displayCountry(code) {
    const country = COUNTRIES.find(c => c.code === code);
    if (!country) return;

    document.getElementById('placeholder').classList.add('hidden');
    document.getElementById('countryCard').classList.remove('hidden');

    document.getElementById('countryName').textContent = `${country.flag} ${country.name}`;
    document.getElementById('capital').textContent = country.capital;
    document.getElementById('region').textContent = country.region;
    document.getElementById('subregion').textContent = country.subregion;
    document.getElementById('population').textContent = country.population.toLocaleString('en-IN');
    document.getElementById('language').textContent = country.language;
    document.getElementById('currency').textContent = country.currency;

    // Flag from REST Countries (CDN)
    const flagImg = document.getElementById('flagImg');
    flagImg.src = `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
    flagImg.alt = `${country.name} flag`;
    flagImg.onerror = () => { flagImg.style.display = 'none'; };

    // Scroll to card
    document.getElementById('countryCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── Region Filter ────────────────────────────────────────────
function filterRegion(region, btn) {
    currentRegion = region;
    document.querySelectorAll('.rchip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const filtered = region === 'all' ? COUNTRIES : COUNTRIES.filter(c => c.region === region);
    renderRegionGrid(filtered);
}

function renderRegionGrid(list) {
    const grid = document.getElementById('regionGrid');
    grid.innerHTML = list.map(c => `
        <div class="rgrid-card" onclick="selectFromGrid('${c.code}')">
            <div class="rgrid-flag">${c.flag}</div>
            <div class="rgrid-name">${c.name}</div>
            <div class="rgrid-cap">📍 ${c.capital}</div>
        </div>
    `).join('');
}

function selectFromGrid(code) {
    const sel = document.getElementById('countrySelect');
    populateDropdown(COUNTRIES);
    document.getElementById('searchCountry').value = '';
    sel.value = code;
    displayCountry(code);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Quiz ─────────────────────────────────────────────────────
function nextQuestion() {
    const q = document.getElementById('quizResult');
    q.classList.add('hidden');
    document.querySelectorAll('.q-opt').forEach(b => { b.classList.remove('correct','wrong'); b.disabled = false; });

    const pool = COUNTRIES;
    const country = pool[Math.floor(Math.random() * pool.length)];
    quizQuestion = country;

    document.getElementById('quizQ').textContent = `What is the capital of ${country.flag} ${country.name}?`;

    // Generate 4 options: 1 correct + 3 random wrong
    const wrong = pool.filter(c => c.code !== country.code)
        .sort(() => Math.random() - 0.5).slice(0, 3).map(c => c.capital);
    const options = [...wrong, country.capital].sort(() => Math.random() - 0.5);

    document.getElementById('quizOpts').innerHTML = options.map(opt =>
        `<button class="q-opt" onclick="checkAnswer('${opt}', this)">${opt}</button>`
    ).join('');
}

function checkAnswer(selected, btn) {
    quizTotal++;
    document.querySelectorAll('.q-opt').forEach(b => b.disabled = true);
    const result = document.getElementById('quizResult');
    result.classList.remove('hidden');

    if (selected === quizQuestion.capital) {
        btn.classList.add('correct');
        result.textContent = `✅ Correct! ${quizQuestion.capital} is the capital of ${quizQuestion.name}.`;
        result.className = 'quiz-result correct';
        quizScore++;
    } else {
        btn.classList.add('wrong');
        document.querySelectorAll('.q-opt').forEach(b => {
            if (b.textContent === quizQuestion.capital) b.classList.add('correct');
        });
        result.textContent = `❌ Wrong! The correct capital is ${quizQuestion.capital}.`;
        result.className = 'quiz-result wrong';
    }
    document.getElementById('quizScore').textContent = quizScore;
    document.getElementById('quizTotal').textContent = quizTotal;
}

// ── Init ─────────────────────────────────────────────────────
window.onload = function () {
    populateDropdown(COUNTRIES);
    renderRegionGrid(COUNTRIES);
    nextQuestion();
};
