// ── JavaScript Date Object ────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function updateClock() {
    const now = new Date();

    // Live time
    const h  = String(now.getHours()).padStart(2, '0');
    const m  = String(now.getMinutes()).padStart(2, '0');
    const s  = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clockTime').textContent = `${h}:${m}:${s}`;

    // Full date string
    document.getElementById('clockDate').textContent =
        `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

    // Day of year
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    document.getElementById('dayOfYear').textContent = Math.floor(diff / oneDay);

    // Week number
    const firstDay = new Date(now.getFullYear(), 0, 1);
    document.getElementById('weekNum').textContent = Math.ceil(((now - firstDay) / oneDay + firstDay.getDay() + 1) / 7);

    // Unix timestamp
    document.getElementById('timestamp').textContent = Math.floor(now.getTime() / 1000);

    // Timezone
    document.getElementById('timezone').textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// ── Date Parts Breakdown ──────────────────────────────────────
function renderDateParts() {
    const now = new Date();
    const parts = [
        { val: now.getFullYear(), lbl: 'Year' },
        { val: String(now.getMonth() + 1).padStart(2,'0'), lbl: 'Month' },
        { val: String(now.getDate()).padStart(2,'0'), lbl: 'Date' },
        { val: DAYS[now.getDay()].slice(0,3), lbl: 'Day' },
        { val: String(now.getHours()).padStart(2,'0'), lbl: 'Hours' },
        { val: String(now.getMinutes()).padStart(2,'0'), lbl: 'Minutes' },
        { val: String(now.getSeconds()).padStart(2,'0'), lbl: 'Seconds' },
        { val: now.getMilliseconds(), lbl: 'Milliseconds' }
    ];
    document.getElementById('partsGrid').innerHTML = parts.map(p =>
        `<div class="part-item"><span class="part-val">${p.val}</span><span class="part-lbl">${p.lbl}</span></div>`
    ).join('');
}

// ── Math Object Operations ────────────────────────────────────
function runMath() {
    const n = parseFloat(document.getElementById('mathInput').value);
    if (isNaN(n)) return;

    const operations = [
        { op: 'Math.sqrt(n)',      expr: `√${n}`,           result: Math.sqrt(n).toFixed(4) },
        { op: 'Math.pow(n, 2)',    expr: `${n}²`,            result: Math.pow(n, 2) },
        { op: 'Math.pow(n, 3)',    expr: `${n}³`,            result: Math.pow(n, 3) },
        { op: 'Math.abs(-n)',      expr: `|−${n}|`,          result: Math.abs(-n) },
        { op: 'Math.floor(n)',     expr: `floor(${n})`,      result: Math.floor(n) },
        { op: 'Math.ceil(n)',      expr: `ceil(${n})`,       result: Math.ceil(n) },
        { op: 'Math.round(n)',     expr: `round(${n})`,      result: Math.round(n) },
        { op: 'Math.log(n)',       expr: `log(${n})`,        result: Math.log(n).toFixed(4) },
        { op: 'Math.log2(n)',      expr: `log₂(${n})`,       result: Math.log2(n).toFixed(4) },
        { op: 'Math.sin(n)',       expr: `sin(${n}°)`,       result: Math.sin(n * Math.PI / 180).toFixed(4) },
        { op: 'Math.cos(n)',       expr: `cos(${n}°)`,       result: Math.cos(n * Math.PI / 180).toFixed(4) },
        { op: 'Math.PI * n',       expr: `π × ${n}`,         result: (Math.PI * n).toFixed(4) }
    ];

    document.getElementById('mathResults').innerHTML = operations.map(o => `
        <div class="math-result-item">
            <div class="mr-op">${o.op}</div>
            <div class="mr-expr">${o.expr}</div>
            <div class="mr-val">${o.result}</div>
        </div>
    `).join('');
}

// ── Random Number Generator (Math.random) ─────────────────────
const rngHistory = [];
function generateRandom() {
    const min = parseInt(document.getElementById('rngMin').value) || 1;
    const max = parseInt(document.getElementById('rngMax').value) || 100;
    if (min >= max) { alert('Min must be less than Max'); return; }

    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    document.getElementById('rngResult').textContent = random;

    rngHistory.unshift(random);
    if (rngHistory.length > 8) rngHistory.pop();
    document.getElementById('rngHistory').innerHTML = rngHistory.map(n =>
        `<span class="rng-pill">${n}</span>`
    ).join('');
}

// ── Days Until New Year (Date arithmetic) ─────────────────────
function renderCountdown() {
    const now = new Date();
    const nextYear = new Date(now.getFullYear() + 1, 0, 1);
    const diff = nextYear - now;

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('countdown').innerHTML = `
        <div class="cd-unit"><span class="cd-num">${days}</span><span class="cd-lbl">Days</span></div>
        <div class="cd-unit"><span class="cd-num">${String(hours).padStart(2,'0')}</span><span class="cd-lbl">Hours</span></div>
        <div class="cd-unit"><span class="cd-num">${String(minutes).padStart(2,'0')}</span><span class="cd-lbl">Minutes</span></div>
        <div class="cd-unit"><span class="cd-num">${String(seconds).padStart(2,'0')}</span><span class="cd-lbl">Seconds</span></div>
    `;
}

// ── Initialize ────────────────────────────────────────────────
window.onload = function () {
    updateClock();
    renderDateParts();
    runMath();
    renderCountdown();

    // Live update every second
    setInterval(() => { updateClock(); renderDateParts(); renderCountdown(); }, 1000);
};
