let isDark = true;

// ── Theme Toggle Event Handler ────────────────────────────────
function toggleTheme() {
    isDark = !isDark;
    const theme = isDark ? 'dark' : 'light';

    // Apply CSS dynamically via data-theme attribute
    document.documentElement.setAttribute('data-theme', theme);

    // Update UI elements
    document.getElementById('toggleIcon').textContent = isDark ? '🌙' : '☀️';
    document.getElementById('toggleLabel').textContent = isDark ? 'Dark Mode' : 'Light Mode';
    document.getElementById('themeBadge').textContent = isDark ? '🌙 Dark Mode Active' : '☀️ Light Mode Active';

    // Animate the toggle icon
    const icon = document.getElementById('toggleIcon');
    icon.style.transform = 'rotate(360deg) scale(1.3)';
    setTimeout(() => { icon.style.transform = ''; }, 400);

    // Update thumb position via class
    const thumb = document.querySelector('.toggle-thumb');
    thumb.style.transform = isDark ? 'translateX(0)' : 'translateX(18px)';

    updateCodeDisplay();
}

// ── Code Display ──────────────────────────────────────────────
function updateCodeDisplay() {
    const code = isDark
        ? `// Event listener on toggle button
document.getElementById('themeToggle')
  .addEventListener('click', function() {

    // Toggle data-theme attribute
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    // Apply CSS dynamically
    html.setAttribute('data-theme', next);
  });

// CSS Variables handle the rest:
// :root[data-theme="dark"] { --bg: #07091a; }
// :root[data-theme="light"] { --bg: #f0f4ff; }`
        : `// Current theme: LIGHT MODE ☀️
// CSS variables are now set to light values:

:root[data-theme="light"] {
    --bg: #f0f4ff;
    --card: #ffffff;
    --text: #1e293b;
    --accent: #6366f1;
}

// No JavaScript repaints needed —
// CSS variables cascade automatically!`;

    document.getElementById('codeDisplay').textContent = code;
}

window.onload = function () {
    updateCodeDisplay();
    // Set initial thumb position
    document.querySelector('.toggle-thumb').style.transform = 'translateX(0)';
};
