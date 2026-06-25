const toggleBtn = document.getElementById('toggleBtn');

function setTheme(mode) {
  document.body.className = mode === 'dark' ? 'dark-mode' : 'light-mode';
  toggleBtn.textContent = mode === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('theme', mode);
}

function loadTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  setTheme(saved);
}

toggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  setTheme(isDark ? 'light' : 'dark');
});

loadTheme();
