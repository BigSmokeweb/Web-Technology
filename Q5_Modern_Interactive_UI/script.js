// ── Theme Toggle ──────────────────────────────────────────────
function toggleTheme() {
    document.body.classList.toggle('light');
}

// ── Navbar Toggle (mobile) ────────────────────────────────────
function toggleNav() {
    document.querySelector('.nav-links').style.display =
        document.querySelector('.nav-links').style.display === 'flex' ? 'none' : 'flex';
}

// ── Smooth Scroll ─────────────────────────────────────────────
function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ── Tabs ──────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(this.dataset.tab).classList.add('active');
    });
});

// ── Accordion ─────────────────────────────────────────────────
function toggleAcc(btn) {
    const body = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');
    document.querySelectorAll('.acc-head').forEach(h => {
        h.classList.remove('open');
        h.nextElementSibling.classList.remove('open');
    });
    if (!isOpen) { btn.classList.add('open'); body.classList.add('open'); }
}

// ── Toast Notifications ───────────────────────────────────────
function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ── Animated Counter ──────────────────────────────────────────
function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
    }, 25);
}

// ── Progress Bar Animation ────────────────────────────────────
function animateProgress() {
    document.querySelectorAll('.prog-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
    });
}

// ── Scroll Reveal (IntersectionObserver) ──────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Counters
            entry.target.querySelectorAll('.hstat-num').forEach(animateCounter);
            // Progress bars
            if (entry.target.querySelector('.prog-fill')) animateProgress();
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .demo-block, .hero-content').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// ── Active nav link on scroll ─────────────────────────────────
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
});

// ── Contact Form ──────────────────────────────────────────────
function handleContact(e) {
    e.preventDefault();
    showToast('✅ Message sent! We\'ll get back to you soon.', 'success');
    e.target.reset();
}
