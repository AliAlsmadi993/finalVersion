



const themeToggleBtn = document.getElementById('theme-toggle');

const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggleBtn.textContent = '☀️';
} else {
  document.body.classList.remove('dark-mode');
  themeToggleBtn.textContent = '🌙';
}

themeToggleBtn.addEventListener('click', () => {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  
  themeToggleBtn.textContent = isDarkMode ? '☀️' : '🌙';
});
