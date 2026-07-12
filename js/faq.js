/**
 * 618 DONER - FAQ PAGE JS
 * Accordion functionality
 */
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('open');
      // Close all
      items.forEach(i => {
        i.querySelector('.faq-q')?.classList.remove('open');
        i.querySelector('.faq-a')?.classList.remove('open');
      });
      // Toggle current
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    });
  });
});
