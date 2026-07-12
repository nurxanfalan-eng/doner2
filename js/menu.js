/**
 * 618 DONER - MENU PAGE JS
 */

let currentProductId = null;

document.addEventListener('DOMContentLoaded', () => {
  renderMenu('fastfood');
  setupTabs();
  setupModal();

  // Handle deep-link from home page
  const hash = window.location.hash;
  if (hash && hash.startsWith('#product-')) {
    const id = parseInt(hash.replace('#product-', ''));
    const product = PRODUCTS.find(p => p.id === id);
    if (product) {
      // Switch to correct tab
      const tabEl = document.querySelector(`[data-cat="${product.category}"]`);
      if (tabEl) tabEl.click();
      // Open modal after small delay
      setTimeout(() => openModal(id), 150);
    }
  }
});

function setupTabs() {
  const tabs = document.querySelectorAll('.cat-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderMenu(tab.dataset.cat);
    });
  });
}

function renderMenu(category) {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;
  const items = PRODUCTS.filter(p => p.category === category);

  if (items.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:#999;padding:40px;grid-column:1/-1;">Bu kateqoriyada məhsul yoxdur</p>';
    return;
  }

  grid.innerHTML = items.map(p => {
    const priceStr = Number.isInteger(p.price) ? p.price.toFixed(0) : p.price.toFixed(2);
    return `
    <article class="product-card" onclick="openModal(${p.id})">
      <img class="product-card-img" src="${p.image}" alt="${p.name}" loading="lazy"
           onerror="this.src='assets/food1.jpg'"/>
      <div class="product-card-body">
        <h3 class="product-card-name">${p.name}</h3>
        <p class="product-card-desc">${p.desc.substring(0,60)}...</p>
        <div class="product-card-footer">
          <span class="product-price">${priceStr} AZN</span>
          <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCartFromMenu(${p.id})" title="Səbətə əlavə et">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </article>`;
  }).join('');
}

function addToCartFromMenu(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (product) Cart.addItem(product);
}

function openModal(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  currentProductId = id;

  const modal = document.getElementById('productModal');
  const img = document.getElementById('modalImg');
  const name = document.getElementById('modalName');
  const desc = document.getElementById('modalDesc');
  const price = document.getElementById('modalPrice');

  img.src = product.image;
  img.alt = product.name;
  img.onerror = function() { this.src = 'assets/food1.jpg'; };
  name.textContent = product.name;
  desc.textContent = product.desc;
  const priceStr = Number.isInteger(product.price) ? product.price.toFixed(0) : product.price.toFixed(2);
  price.textContent = `${priceStr} AZN`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('productModal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
  currentProductId = null;
  // Clean hash
  history.replaceState(null, '', window.location.pathname);
}

function setupModal() {
  const modal = document.getElementById('productModal');
  const closeBtn = document.getElementById('modalClose');
  const addBtn = document.getElementById('modalAddBtn');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (currentProductId !== null) {
        const product = PRODUCTS.find(p => p.id === currentProductId);
        if (product) Cart.addItem(product);
        closeModal();
      }
    });
  }

  // Click outside to close
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}
