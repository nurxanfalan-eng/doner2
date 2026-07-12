/**
 * 618 DONER - ABOUT PAGE JS
 * Working hours status check
 */
document.addEventListener('DOMContentLoaded', () => {
  checkWorkingHours();
});

function checkWorkingHours() {
  const statusEl = document.getElementById('currentStatus');
  if (!statusEl) return;

  const now = new Date();
  const day = now.getDay(); // 0=Sunday, 1=Monday ... 6=Saturday
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeVal = hour * 60 + minute;

  // Hours: Mon-Thu 10-22, Fri-Sat 10-23, Sun 11-22
  let openMin, closeMin;
  if (day === 0) { // Sunday
    openMin = 11 * 60; closeMin = 22 * 60;
  } else if (day >= 5) { // Fri, Sat
    openMin = 10 * 60; closeMin = 23 * 60;
  } else { // Mon-Thu
    openMin = 10 * 60; closeMin = 22 * 60;
  }

  const isOpen = timeVal >= openMin && timeVal < closeMin;
  if (isOpen) {
    statusEl.textContent = '✓ Hazırda açığıq!';
    statusEl.style.color = '#27ae60';
    statusEl.style.fontWeight = '700';
  } else {
    statusEl.textContent = '✗ Hazırda bağlıyıq';
    statusEl.style.color = '#e74c3c';
    statusEl.style.fontWeight = '700';
  }
}
