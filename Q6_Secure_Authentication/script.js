// ── Regex Patterns ────────────────────────────────────────────
const REGEX = {
    name:  /^[a-zA-Z\s]{3,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    phone: /^[6-9]\d{9}$/,
    pass:  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// ── LocalStorage "Database" (JSON credentials) ────────────────
function getUsers() { return JSON.parse(localStorage.getItem('secureUsers') || '[]'); }
function saveUsers(users) { localStorage.setItem('secureUsers', JSON.stringify(users)); }
function getSession() { return JSON.parse(sessionStorage.getItem('currentUser') || 'null'); }
function saveSession(user) { sessionStorage.setItem('currentUser', JSON.stringify(user)); }
function clearSession() { sessionStorage.removeItem('currentUser'); }

// ── Panel Switch ──────────────────────────────────────────────
function switchPanel(panel) {
    document.getElementById('registerCard').classList.add('hidden');
    document.getElementById('loginCard').classList.add('hidden');
    document.getElementById('dashCard').classList.add('hidden');
    document.getElementById(panel + 'Card').classList.remove('hidden');
}

// ── Register Field Validation (Regex) ────────────────────────
function validateField(fieldId) {
    const val = document.getElementById(fieldId).value.trim();
    const wrap = document.getElementById(fieldId).closest('.input-wrap');
    let err = '';

    if (fieldId === 'regName') {
        if (!val) err = 'Name is required';
        else if (!REGEX.name.test(val)) err = 'Only letters & spaces, 3-50 chars';
    }
    if (fieldId === 'regEmail') {
        if (!val) err = 'Email is required';
        else if (!REGEX.email.test(val)) err = 'Enter a valid email address';
    }
    if (fieldId === 'regPhone') {
        if (!val) err = 'Phone is required';
        else if (!REGEX.phone.test(val)) err = 'Enter valid 10-digit Indian mobile number';
    }
    if (fieldId === 'regPass') {
        if (!val) err = 'Password is required';
        else if (!REGEX.pass.test(val)) err = 'Min 8 chars, 1 uppercase, 1 digit, 1 special char';
    }
    if (fieldId === 'regConf') {
        const pass = document.getElementById('regPass').value;
        if (!val) err = 'Please confirm your password';
        else if (val !== pass) err = 'Passwords do not match';
    }

    const errEl = document.getElementById(fieldId + 'Err');
    errEl.textContent = err;
    wrap.className = 'input-wrap ' + (err ? 'error' : val ? 'valid' : '');
    return !err;
}

// ── Password Strength ─────────────────────────────────────────
function updateStrength() {
    const val = document.getElementById('regPass').value;
    const bar = document.getElementById('strengthBar');
    const label = document.getElementById('strengthLabel');
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/\d/.test(val)) score++;
    if (/[@$!%*?&]/.test(val)) score++;
    if (val.length >= 12) score++;
    const levels = [
        { w:'0%', c:'transparent', t:'' },
        { w:'25%', c:'#ef4444', t:'Weak' },
        { w:'50%', c:'#f97316', t:'Fair' },
        { w:'75%', c:'#eab308', t:'Good' },
        { w:'90%', c:'#22c55e', t:'Strong' },
        { w:'100%', c:'#10b981', t:'Very Strong' }
    ];
    const lvl = levels[Math.min(score, 5)];
    bar.style.width = lvl.w;
    bar.style.background = lvl.c;
    label.textContent = lvl.t;
}

// ── Toggle Password Visibility ────────────────────────────────
function togglePwd(id, btn) {
    const inp = document.getElementById(id);
    inp.type = inp.type === 'password' ? 'text' : 'password';
    btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}

// ── Register Handler (AJAX-style with JSON) ───────────────────
function handleRegister(e) {
    e.preventDefault();
    const fields = ['regName', 'regEmail', 'regPhone', 'regPass', 'regConf'];
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) return;
    if (!document.getElementById('agreeTerms').checked) {
        showAuthMsg('registerForm', 'Please agree to the Terms of Service.', 'error');
        return;
    }

    setLoading('regBtn', true);

    // Simulate AJAX delay (JSON storage)
    setTimeout(() => {
        const users = getUsers();
        const email = document.getElementById('regEmail').value.trim().toLowerCase();
        if (users.find(u => u.email === email)) {
            showAuthMsg('regMsg', '❌ An account with this email already exists.', 'error');
            setLoading('regBtn', false);
            return;
        }

        // Store credentials as JSON
        const newUser = {
            id: Date.now(),
            name: document.getElementById('regName').value.trim(),
            email,
            phone: document.getElementById('regPhone').value.trim(),
            password: btoa(document.getElementById('regPass').value), // base64 encode
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        saveUsers(users);

        showAuthMsg('regMsg', '✅ Account created successfully! Redirecting...', 'success');
        setLoading('regBtn', false);
        setTimeout(() => {
            saveSession(newUser);
            showDashboard(newUser);
        }, 1500);
    }, 1000);
}

// ── Login Handler (AJAX without refresh) ─────────────────────
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPass').value;
    let valid = true;

    if (!REGEX.email.test(email)) {
        document.getElementById('loginEmailErr').textContent = 'Enter a valid email address';
        valid = false;
    } else document.getElementById('loginEmailErr').textContent = '';

    if (!pass) {
        document.getElementById('loginPassErr').textContent = 'Password is required';
        valid = false;
    } else document.getElementById('loginPassErr').textContent = '';

    if (!valid) return;
    setLoading('loginBtn', true);

    // AJAX-style async validation (JSON lookup)
    setTimeout(() => {
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === btoa(pass));
        if (user) {
            showAuthMsg('loginMsg', '✅ Login successful! Redirecting...', 'success');
            setLoading('loginBtn', false);
            saveSession(user);
            setTimeout(() => showDashboard(user), 1200);
        } else {
            showAuthMsg('loginMsg', '❌ Invalid email or password.', 'error');
            setLoading('loginBtn', false);
        }
    }, 800);
}

// ── Dashboard ─────────────────────────────────────────────────
function showDashboard(user) {
    document.getElementById('dashName').textContent = user.name.split(' ')[0];
    document.getElementById('dashEmail').textContent = user.email;
    document.getElementById('dashPhone').textContent = user.phone || 'Not provided';
    document.getElementById('dashTime').textContent = new Date().toLocaleString();
    switchPanel('dash');
}

function logout() {
    clearSession();
    switchPanel('login');
    document.getElementById('loginForm').reset();
    document.getElementById('loginEmailErr').textContent = '';
    document.getElementById('loginPassErr').textContent = '';
    document.getElementById('loginMsg').classList.add('hidden');
}

// ── Helpers ───────────────────────────────────────────────────
function showAuthMsg(id, msg, type) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.className = `auth-msg ${type}`;
}

function setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    btn.querySelector('span').style.display = loading ? 'none' : 'inline';
    btn.querySelector('.btn-loader').classList.toggle('hidden', !loading);
    btn.disabled = loading;
}

function validateLoginField(id) {
    const val = document.getElementById(id).value.trim();
    const err = REGEX.email.test(val) ? '' : 'Enter a valid email address';
    document.getElementById(id + 'Err').textContent = err;
}

function showForgot() { alert('Password reset: Please contact support.'); }

// ── Auto-login from session ───────────────────────────────────
window.onload = function () {
    const session = getSession();
    if (session) showDashboard(session);
    else switchPanel('login');
};
