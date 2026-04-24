// ════════════════════════════════════════════════════════
//  FEATURE 1: DARK / LIGHT MODE TOGGLE (Independent)
// ════════════════════════════════════════════════════════
let isDark = true;

function toggleTheme() {
    isDark = document.getElementById('themeCheck').checked;
    const theme = isDark ? 'light' : 'dark'; // checkbox checked = light
    document.documentElement.setAttribute('data-theme', theme);

    // Update UI labels dynamically via CSS + JS
    const icon = isDark ? '☀️' : '🌙';
    const name = isDark ? 'Light Mode' : 'Dark Mode';
    document.getElementById('themeLabel').textContent = `${icon} ${isDark ? 'Light' : 'Dark'}`;
    document.getElementById('tdIcon').textContent = icon;
    document.getElementById('tdName').textContent = name;
}

// ════════════════════════════════════════════════════════
//  FEATURE 2: FORM VALIDATION (Independent of Theme)
// ════════════════════════════════════════════════════════
const REGEX = {
    sName:  /^[a-zA-Z\s]{3,}$/,
    sEmail: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    sPass:  /^(?=.*[A-Z])(?=.*\d).{8,}$/,
    sPhone: /^[6-9]\d{9}$/
};

const MSGS = {
    sName:  'Name must be 3+ letters only',
    sEmail: 'Enter a valid email (e.g. user@mail.com)',
    sPass:  'Min 8 chars, 1 uppercase letter, 1 digit',
    sPhone: 'Enter a valid 10-digit Indian mobile number'
};

const RULE_IDS = { sName:'rl-name', sEmail:'rl-email', sPass:'rl-pass', sPhone:'rl-phone' };

function validate(fieldId) {
    const input = document.getElementById(fieldId);
    const val = input.value.trim();
    const ok = val.length > 0 && REGEX[fieldId].test(val);

    // Set input border color dynamically
    input.className = val.length === 0 ? '' : ok ? 'valid' : 'invalid';

    // Show/clear error message
    const errEl = document.getElementById(`e-${fieldId}`);
    errEl.textContent = (!ok && val.length > 0) ? MSGS[fieldId] : '';

    // Update validation rules sidebar
    const ruleEl = document.getElementById(RULE_IDS[fieldId]);
    ruleEl.classList.remove('pass','fail');
    if (val.length > 0) ruleEl.classList.add(ok ? 'pass' : 'fail');

    return ok;
}

function togglePass(id, btn) {
    const inp = document.getElementById(id);
    inp.type = inp.type === 'password' ? 'text' : 'password';
    btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}

function submitForm(e) {
    e.preventDefault();
    const fields = ['sName','sEmail','sPass','sPhone'];
    const allValid = fields.map(f => validate(f)).every(Boolean);

    const msgEl = document.getElementById('sfMsg');
    if (allValid) {
        msgEl.textContent = '✅ Registration successful! Welcome aboard.';
        msgEl.className = 'sf-msg success';
        setTimeout(() => {
            document.getElementById('smartForm').reset();
            fields.forEach(f => {
                document.getElementById(f).className = '';
                document.getElementById(`e-${f}`).textContent = '';
                document.getElementById(RULE_IDS[f]).classList.remove('pass','fail');
            });
            msgEl.classList.add('hidden');
        }, 3000);
    } else {
        msgEl.textContent = '❌ Please fix all highlighted errors before submitting.';
        msgEl.className = 'sf-msg error';
        setTimeout(() => msgEl.classList.add('hidden'), 4000);
    }
}

// ── Initialize: both features start independently ────────────
window.onload = function () {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('themeCheck').checked = false;
};
