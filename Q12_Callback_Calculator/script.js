// ── Higher-order function: processes array using a callback ───
function processArray(numbers, callback) {
    return numbers.map(callback);
}

// ── Reusable Callback Functions (Math Operations) ─────────────
const callbacks = {
    square:    n => n * n,
    cube:      n => n ** 3,
    double:    n => n * 2,
    sqrt:      n => +Math.sqrt(n).toFixed(3),
    factorial: n => {
        if (n < 0) return 'N/A';
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result > 1e15 ? result.toExponential(2) : result;
    },
    isPrime: n => {
        if (n < 2) return false;
        if (n === 2) return true;
        if (n % 2 === 0) return false;
        for (let i = 3; i <= Math.sqrt(n); i += 2) if (n % i === 0) return false;
        return true;
    }
};

let currentNumbers = [2, 3, 4, 5, 6];

// ── Parse Input Array ────────────────────────────────────────
function parseAndRun() {
    const raw = document.getElementById('arrayInput').value;
    const nums = raw.split(',').map(s => s.trim()).filter(s => s !== '').map(Number);
    if (nums.some(isNaN)) {
        document.getElementById('parsedArr').innerHTML =
            `<span style="color:#f87171;font-size:0.85rem">❌ Invalid input. Use numbers separated by commas.</span>`;
        return;
    }
    currentNumbers = nums;
    renderParsed(nums);
    // Clear previous results
    Object.keys(callbacks).forEach(op => {
        document.getElementById(`res-${op}`).textContent = '';
        document.getElementById(`res-${op}`).classList.remove('has-result');
        document.getElementById(`op-${op}`).classList.remove('active');
    });
}

function renderParsed(nums) {
    document.getElementById('parsedArr').innerHTML =
        nums.map(n => `<div class="num-pill">${n}</div>`).join('');
}

// ── Run a single operation ────────────────────────────────────
function runOp(opName) {
    const results = processArray(currentNumbers, callbacks[opName]);
    const el = document.getElementById(`res-${opName}`);
    const card = document.getElementById(`op-${opName}`);

    let display;
    if (opName === 'isPrime') {
        display = currentNumbers.map((n, i) => `${n}→${results[i] ? 'Prime' : 'No'}`).join(', ');
    } else {
        display = results.join(', ');
    }

    el.textContent = `[${display}]`;
    el.classList.add('has-result');
    card.classList.add('active');
}

// ── Run All Operations ────────────────────────────────────────
function runAll() {
    Object.keys(callbacks).forEach((op, i) => {
        setTimeout(() => runOp(op), i * 150);
    });
}

// ── Initialize ───────────────────────────────────────────────
window.onload = function () {
    renderParsed(currentNumbers);
};
