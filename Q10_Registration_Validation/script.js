const RULES = {
    name:  { regex: /^[a-zA-Z\s]{3,50}$/, msg: 'Name must be 3–50 letters only' },
    email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, msg: 'Enter a valid email address' },
    pass:  { regex: /^(?=.*[A-Z])(?=.*\d).{8,}$/, msg: 'Min 8 chars, 1 uppercase, 1 digit required' },
    conf:  { custom: true, msg: 'Passwords do not match' },
    terms: { custom: true, msg: 'You must accept the terms' }
};

const IDS = { name:'fname', email:'femail', pass:'fpass', conf:'fconf' };

function liveValidate(field) {
    const isValid = validateField(field);
    updateRule(field, isValid);
}

function validateField(field) {
    if (field === 'terms') {
        const ok = document.getElementById('terms').checked;
        setErr('err-terms', ok ? '' : RULES.terms.msg);
        return ok;
    }
    if (field === 'conf') {
        const val = document.getElementById('fconf').value;
        const pass = document.getElementById('fpass').value;
        const ok = val === pass && val.length > 0;
        setErr('err-conf', ok ? '' : RULES.conf.msg);
        setWrap('iw-conf', val.length === 0 ? '' : ok ? 'valid' : 'invalid');
        setStatusIcon('si-conf', val.length === 0 ? '' : ok ? '✅' : '❌');
        return ok;
    }
    const inputId = IDS[field];
    const val = document.getElementById(inputId).value.trim();
    const rule = RULES[field];
    const ok = val.length > 0 && rule.regex.test(val);
    setErr(`err-${field}`, val.length === 0 ? '' : ok ? '' : rule.msg);
    setWrap(`iw-${field}`, val.length === 0 ? '' : ok ? 'valid' : 'invalid');
    setStatusIcon(`si-${field}`, val.length === 0 ? '' : ok ? '✅' : '❌');
    return ok && val.length > 0;
}

function focusField(field) { document.getElementById(`iw-${field}`).classList.add('focused'); }
function blurField(field) { document.getElementById(`iw-${field}`).classList.remove('focused'); }

function setErr(id, msg) { const el = document.getElementById(id); if(el) el.textContent = msg; }
function setWrap(id, state) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('valid','invalid');
    if (state) el.classList.add(state);
}
function setStatusIcon(id, icon) { const el = document.getElementById(id); if(el) el.textContent = icon; }

function updateRule(field, isValid) {
    const el = document.getElementById(`r-${field}`);
    if (!el) return;
    el.classList.remove('pass','fail');
    const icon = el.querySelector('.r-icon');
    if (isValid) { el.classList.add('pass'); icon.textContent = '✅'; }
    else { el.classList.add('fail'); icon.textContent = '❌'; }
}

// Password Strength Meter
function updateStrength() {
    const val = document.getElementById('fpass').value;
    const bar = document.getElementById('sBar');
    const label = document.getElementById('sLabel');
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/\d/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    if (val.length >= 14) score++;
    const levels = [
        {w:'0%',c:'transparent',t:''},
        {w:'20%',c:'#ef4444',t:'Very Weak'},
        {w:'40%',c:'#f97316',t:'Weak'},
        {w:'60%',c:'#eab308',t:'Fair'},
        {w:'80%',c:'#22c55e',t:'Strong'},
        {w:'100%',c:'#10b981',t:'Very Strong'}
    ];
    const lvl = levels[Math.min(score, 5)];
    bar.style.width = lvl.w;
    bar.style.background = lvl.c;
    label.textContent = lvl.t;
}

function toggleEye(id, btn) {
    const inp = document.getElementById(id);
    inp.type = inp.type === 'password' ? 'text' : 'password';
    btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}

// Form Submit
function handleSubmit(e) {
    e.preventDefault();
    const fields = ['name','email','pass','conf','terms'];
    const allValid = fields.map(f => { const v = validateField(f); updateRule(f, v); return v; }).every(Boolean);
    if (!allValid) {
        showMsg('❌ Please fix all errors before submitting.', 'error');
        return;
    }
    const btn = document.getElementById('submitBtn');
    btn.querySelector('#btnText').style.display = 'none';
    btn.querySelector('#btnLoader').classList.remove('hidden');
    btn.disabled = true;
    setTimeout(() => {
        btn.querySelector('#btnText').style.display = 'inline';
        btn.querySelector('#btnLoader').classList.add('hidden');
        btn.disabled = false;
        showMsg('✅ Registration successful! Welcome aboard.', 'success');
        document.getElementById('regForm').reset();
        ['name','email','pass','conf'].forEach(f => { setWrap(`iw-${f}`,''); setStatusIcon(`si-${f}`,''); });
        document.getElementById('sBar').style.width = '0';
        document.getElementById('sLabel').textContent = '';
        fields.forEach(f => updateRule(f, false));
    }, 1200);
}

function showMsg(text, type) {
    const el = document.getElementById('formMsg');
    el.textContent = text;
    el.className = `form-msg ${type}`;
    setTimeout(() => el.classList.add('hidden'), 5000);
}
