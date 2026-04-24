// ── Prime Check Logic ─────────────────────────────────────────
function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

function getPrimeSteps(n) {
    const steps = [];
    if (n < 2) { steps.push({ text: `${n} < 2, so it cannot be prime.`, ok: false }); return steps; }
    steps.push({ text: `${n} ≥ 2 — basic check passed.`, ok: true });
    if (n === 2) { steps.push({ text: `${n} = 2 — the only even prime.`, ok: true }); return steps; }
    if (n % 2 === 0) { steps.push({ text: `${n} ÷ 2 = ${n/2} — divisible by 2, not prime.`, ok: false }); return steps; }
    steps.push({ text: `${n} is odd — not divisible by 2.`, ok: true });
    const limit = Math.floor(Math.sqrt(n));
    steps.push({ text: `Checking divisors from 3 to √${n} ≈ ${limit}...`, ok: true });
    for (let i = 3; i <= limit; i += 2) {
        if (n % i === 0) {
            steps.push({ text: `${n} ÷ ${i} = ${n/i} — divisor found! Not prime.`, ok: false });
            return steps;
        }
    }
    steps.push({ text: `No divisors found — ${n} is prime! ✓`, ok: true });
    return steps;
}

// ── Event: Check Button ───────────────────────────────────────
function checkPrime() {
    const val = document.getElementById('numInput').value.trim();
    if (val === '') { showResult(null, 'Please enter a number.'); return; }
    const n = parseInt(val);
    if (isNaN(n) || n < 0) { showResult(null, 'Enter a valid non-negative integer.'); return; }
    const prime = isPrime(n);
    showResult(prime, n);
    showSteps(n);
    addToHistory(n, prime);
}

function showResult(prime, n) {
    const el = document.getElementById('result');
    el.classList.remove('hidden', 'prime', 'not-prime');
    if (prime === null) {
        el.innerHTML = `<div class="result-text" style="color:#f59e0b">${n}</div>`;
        el.className = 'result not-prime';
        return;
    }
    el.classList.add(prime ? 'prime' : 'not-prime');
    el.innerHTML = `
        <div class="result-icon">${prime ? '✅' : '❌'}</div>
        <div class="result-text">${n} is ${prime ? '' : 'NOT '}a Prime Number</div>
        <div class="result-sub">${prime
            ? `${n} has exactly 2 divisors: 1 and itself.`
            : `${n} has more than 2 divisors, so it is composite.`
        }</div>
    `;
}

function showSteps(n) {
    const steps = getPrimeSteps(n);
    const el = document.getElementById('steps');
    el.classList.remove('hidden');
    el.innerHTML = `<h4>Step-by-step Check</h4>` +
        steps.map(s => `<div class="step-item ${s.ok ? 'done' : 'fail'}">${s.ok ? '✓' : '✗'} ${s.text}</div>`).join('');
}

function clearResult() {
    document.getElementById('result').classList.add('hidden');
    document.getElementById('steps').classList.add('hidden');
}

// ── History ───────────────────────────────────────────────────
let history = [];
function addToHistory(n, prime) {
    history.unshift({ n, prime });
    if (history.length > 10) history.pop();
    renderHistory();
}

function renderHistory() {
    const el = document.getElementById('historyList');
    if (!history.length) { el.innerHTML = '<p class="empty-hist">No checks yet.</p>'; return; }
    el.innerHTML = history.map(h => `
        <div class="hist-item">
            <span class="hist-num">${h.n}</span>
            <span class="hist-badge ${h.prime ? 'prime' : 'not'}">${h.prime ? 'PRIME' : 'NOT PRIME'}</span>
        </div>
    `).join('');
}

function clearHistory() { history = []; renderHistory(); }

// ── First 20 Primes ───────────────────────────────────────────
function renderFirstPrimes() {
    const primes = [];
    let n = 2;
    while (primes.length < 20) { if (isPrime(n)) primes.push(n); n++; }
    document.getElementById('primesList').innerHTML = primes.map(p =>
        `<div class="prime-pill" onclick="document.getElementById('numInput').value=${p};checkPrime()">${p}</div>`
    ).join('');
}

window.onload = renderFirstPrimes;
