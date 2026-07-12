/**
 * 618 DONER - CART MANAGER
 * Handles cart state across all pages using localStorage
 */

const Cart = {
  KEY: '618_doner_cart',

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch { return []; }
  },

  saveItems(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadge();
  },

  addItem(product) {
    const items = this.getItems();
    const idx = items.findIndex(i => i.id === product.id);
    if (idx > -1) {
      items[idx].qty += 1;
    } else {
      items.push({ ...product, qty: 1 });
    }
    this.saveItems(items);
    showToast(`"${product.name}" səbətə əlavə edildi`, 'success');
  },

  removeItem(productId) {
    const items = this.getItems().filter(i => i.id !== productId);
    this.saveItems(items);
  },

  updateQty(productId, qty) {
    if (qty < 1) { this.removeItem(productId); return; }
    const items = this.getItems();
    const idx = items.findIndex(i => i.id === productId);
    if (idx > -1) { items[idx].qty = qty; this.saveItems(items); }
  },

  getTotal() {
    return this.getItems().reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  getTotalCount() {
    return this.getItems().reduce((sum, i) => sum + i.qty, 0);
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this.updateBadge();
  },

  updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const count = this.getTotalCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'flex';
    if (count > 0) {
      badge.style.background = '#e74c3c';
    }
  }
};

// ---- TOAST ----
let toastContainer = null;
function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

function showToast(msg, type = 'success') {
  const container = getToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle';
  toast.innerHTML = `<i class="fas ${icon}"></i><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut .3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ---- NAVBAR ----
function initNavbar() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  // Scroll shadow
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }
}

// Init on every page
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  initNavbar();
});

window.Cart = Cart;
window.showToast = showToast;
