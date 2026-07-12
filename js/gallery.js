/**
 * 618 DONER - GALLERY PAGE JS
 * Optimized lightbox with swipe/keyboard support
 */

let currentIndex = 0;
let touchStartX = 0;

document.addEventListener('DOMContentLoaded', () => {
  renderGallery();
  setupLightbox();
});

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  grid.innerHTML = GALLERY_IMAGES.map((img, i) => `
    <div class="gallery-item" onclick="openLightbox(${i})">
      <img src="${img.src}" alt="${img.alt}" loading="lazy"
           onerror="this.src='assets/food1.jpg'" />
      <div class="gallery-item-overlay">
        <i class="fas fa-search-plus"></i>
      </div>
    </div>
  `).join('');
}

function openLightbox(index) {
  currentIndex = index;
  showLightboxImage();
  const lb = document.getElementById('lightbox');
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

function showLightboxImage() {
  const img = document.getElementById('lbImg');
  const counter = document.getElementById('lbCounter');
  if (!img || !GALLERY_IMAGES.length) return;

  const item = GALLERY_IMAGES[currentIndex];
  img.src = item.src;
  img.alt = item.alt;
  img.onerror = function() { this.src = 'assets/food1.jpg'; };
  if (counter) counter.textContent = `${currentIndex + 1} / ${GALLERY_IMAGES.length}`;
}

function prevImage() {
  currentIndex = (currentIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  showLightboxImage();
}

function nextImage() {
  currentIndex = (currentIndex + 1) % GALLERY_IMAGES.length;
  showLightboxImage();
}

function setupLightbox() {
  const lb = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lbClose');
  const prevBtn = document.getElementById('lbPrev');
  const nextBtn = document.getElementById('lbNext');
  const lbImg = document.getElementById('lbImg');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);

  // Click outside image to close
  if (lb) {
    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') prevImage();
    else if (e.key === 'ArrowRight') nextImage();
    else if (e.key === 'Escape') closeLightbox();
  });

  // Touch/swipe support
  if (lbImg) {
    lbImg.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lbImg.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextImage(); else prevImage();
      }
    }, { passive: true });
  }
}
