/* ============================================================
   618 DONER - app.js (Single Page Application)
   All pages merged into one JS file for optimal performance
   ============================================================ */

'use strict';

/* ============================================================
   DATA
   ============================================================ */
const PRODUCTS = [
  { id:1,  name:"Dürüm",           price:3.5,  category:"fastfood",  image:"assets/dürüm.jpg",  desc:"Keyfiyyətli dönər əti, təzə tərəvəzlər və xüsusi sous ilə hazırlanmış klassik dürüm. Hər loğmada əsl ləzzət!", popular:true  },
  { id:2,  name:"Tələbə Dürüm",    price:3.0,  category:"fastfood",  image:"assets/susi.jpg",  desc:"Büdcəyə uyğun, eyni keyfiyyətli dönər əti ilə hazırlanmış gənc dürümü. Dadlı və sərfəli!", popular:true  },
  { id:3,  name:"Duble Dürüm",     price:4.5,  category:"fastfood",  image:"assets/susi.jpg",  desc:"İkiqat dönər əti ilə hazırlanmış böyük dürüm. Daha çox ərzaq, daha çox ləzzət – iştahı böyük olanlar üçün ideal!", popular:true  },
  { id:4,  name:"Mega Dürüm",      price:5.5,  category:"fastfood",  image:"assets/susi.jpg",  desc:"Nəhəng porsiya dönər əti, bol tərəvəz və xüsusi sous ilə hazırlanmış mega dürüm. Əsl doyumlu seçim!", popular:false },
  { id:5,  name:"Suşi",            price:6.0,  category:"fastfood",  image:"assets/susi.jpg",  desc:"Keyfiyyətli dönər əti ilə hazırlanmış xüsusi suşi. Unikal bir ləzzət təcrübəsi – siz də sınayın!", popular:true  },
  { id:6,  name:"Fanta 0.5L",      price:1.5,  category:"icecekler", image:"assets/fanta.jpg", desc:"Soyuq və seyreltici portağal Fanta. Yemək yanında mükəmməl seçim!", popular:false },
  { id:7,  name:"Coca-Cola 0.5L",  price:1.5,  category:"icecekler", image:"assets/fanta.jpg", desc:"Klassik soyuq Coca-Cola. Hər yemək yanında yer alan ikonik içki!", popular:false },
  { id:8,  name:"Su 0.5L",         price:0.5,  category:"icecekler", image:"assets/fanta.jpg", desc:"Soyuq mineral su. Seyrəltici və sağlam!", popular:false },
  { id:9,  name:"Menu 1 (250 qr)", price:7.5,  category:"setler",    image:"assets/susi.jpg",  desc:"250 qramlıq keyfiyyətli dönər əti set menyusu. İçki daxildir. Sərfəli və doyumlu!", popular:false },
  { id:10, name:"Menu 2 (500 qr)", price:15.0, category:"setler",    image:"assets/susi.jpg",  desc:"500 qramlıq keyfiyyətli dönər əti set menyusu. İçki daxildir. Ailə üçün ideal seçim!", popular:true  },
  { id:11, name:"Menu 3 (750 qr)", price:22.0, category:"setler",    image:"assets/susi.jpg",  desc:"750 qramlıq keyfiyyətli dönər əti set menyusu. İçki daxildir. Böyük şirkətlər üçün əla seçim!", popular:false },
  { id:12, name:"Menu 4 (1000 qr)",price:27.0, category:"setler",    image:"assets/susi.jpg",  desc:"1000 qramlıq nəhəng dönər əti set menyusu. İçki daxildir. Böyük ziyafət seçimi!", popular:false }
];

const GALLERY_IMAGES = [
  { src:"assets/food1.jpg", alt:"Dönər" },
  { src:"assets/susi.jpg",  alt:"Keyfiyyətli ət" },
  { src:"assets/food1.jpg", alt:"Dürüm" },
  { src:"assets/susi.jpg",  alt:"Xüsusi ət" },
  { src:"assets/food1.jpg", alt:"Mega dürüm" },
  { src:"assets/susi.jpg",  alt:"Ət xörəyi" },
  { src:"assets/fanta.jpg", alt:"Fanta içki" }
];

/* ============================================================
   CART
   ============================================================ */
const Cart = {
  KEY: '618_doner_cart',

  getItems() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch { return []; }
  },

  saveItems(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadge();
  },

  addItem(product) {
    const items = this.getItems();
    const idx = items.findIndex(i => i.id === product.id);
    if (idx > -1) { items[idx].qty += 1; }
    else { items.push({ ...product, qty: 1 }); }
    this.saveItems(items);
    showToast(`"${product.name}" səbətə əlavə edildi`, 'success');
  },

  removeItem(productId) {
    this.saveItems(this.getItems().filter(i => i.id !== productId));
  },

  updateQty(productId, qty) {
    if (qty < 1) { this.removeItem(productId); return; }
    const items = this.getItems();
    const idx = items.findIndex(i => i.id === productId);
    if (idx > -1) { items[idx].qty = qty; this.saveItems(items); }
  },

  getTotal() {
    return this.getItems().reduce((s, i) => s + i.price * i.qty, 0);
  },

  getTotalCount() {
    return this.getItems().reduce((s, i) => s + i.qty, 0);
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
    badge.style.background = count > 0 ? '#e74c3c' : '#e74c3c';
  }
};

/* ============================================================
   TOAST
   ============================================================ */
let _toastContainer = null;

function getToastContainer() {
  if (!_toastContainer) {
    _toastContainer = document.createElement('div');
    _toastContainer.className = 'toast-container';
    document.body.appendChild(_toastContainer);
  }
  return _toastContainer;
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

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a[data-page]').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }
}

/* ============================================================
   SPA ROUTER
   ============================================================ */
const pages = ['home', 'menu', 'gallery', 'order', 'about', 'faq', 'contact'];

const pageTitles = {
  home:    'Cengiz Efendi',
  menu:    'Cengiz Efendi | Menyu',
  gallery: '618 Dönər | Qalerya',
  order:   'Cengiz Efendi | Sifariş',
  about:   '618 Dönər | Haqqında',
  faq:     '618 Dönər | FAQ',
  contact: '618 Dönər | Əlaqə'
};

function navigateTo(page, pushState = true) {
  if (!pages.includes(page)) page = 'home';

  // Update active nav link
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });

  // Update footer links active state
  document.querySelectorAll('.footer-links a[data-page]').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });

  // Hide all sections
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-page'));

  // Show target section
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active-page');

  // Update title
  document.title = pageTitles[page] || 'Cengiz Efendi';

  // Push history
  if (pushState) {
    history.pushState({ page }, '', page === 'home' ? '/' : `#${page}`);
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Run page init
  pageInits[page] && pageInits[page]();

  // Update cart badge
  Cart.updateBadge();

  // Update cart FAB onclick for order page
  const fab = document.getElementById('cartFab');
  if (fab) {
    if (page === 'order') {
      fab.onclick = () => {
        const el = document.getElementById('orderCartSection');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      };
    } else {
      fab.onclick = () => navigateTo('order');
    }
  }
}

/* ============================================================
   PAGE INITS
   ============================================================ */
const pageInits = {
  home:    initHome,
  menu:    initMenu,
  gallery: initGallery,
  order:   initOrder,
  about:   initAbout,
  faq:     initFaq,
  contact: () => {}
};

/* ---- HOME ---- */
let _homeInited = false;
function initHome() {
  if (_homeInited) return;
  _homeInited = true;
  renderPopular();
}

function renderPopular() {
  const grid = document.getElementById('popularGrid');
  if (!grid) return;
  const popular = PRODUCTS.filter(p => p.popular).slice(0, 4);
  grid.innerHTML = popular.map(p => createProductCard(p, 'menu')).join('');
}

function createProductCard(p, targetPage) {
  const priceStr = Number.isInteger(p.price) ? p.price.toFixed(0) : p.price.toFixed(2);
  return `
    <article class="product-card" onclick="openProductModal(${p.id})">
      <img class="product-card-img" src="${p.image}" alt="${p.name}" loading="lazy"
           onerror="this.src='assets/food1.jpg'"/>
      <div class="product-card-body">
        <h3 class="product-card-name">${p.name}</h3>
        <p class="product-card-desc">${p.desc.substring(0, 60)}...</p>
        <div class="product-card-footer">
          <span class="product-price">${priceStr} AZN</span>
          <button class="add-to-cart-btn" onclick="event.stopPropagation(); Cart.addItem(PRODUCTS.find(x=>x.id===${p.id}))" title="Səbətə əlavə et">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </article>`;
}

/* ---- MENU ---- */
let _currentProductId = null;
let _menuInited = false;

function initMenu() {
  if (!_menuInited) {
    setupTabs();
    setupModal();
    _menuInited = true;
  }
  renderMenu('fastfood');
  // Reset tabs
  document.querySelectorAll('.cat-tab').forEach((t, i) => t.classList.toggle('active', i === 0));
}

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

function openProductModal(id) {
  navigateTo('menu');
  setTimeout(() => openModal(id), 80);
}

function openModal(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  _currentProductId = id;

  const modal  = document.getElementById('productModal');
  const img    = document.getElementById('modalImg');
  const name   = document.getElementById('modalName');
  const desc   = document.getElementById('modalDesc');
  const price  = document.getElementById('modalPrice');

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
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  _currentProductId = null;
}

function setupModal() {
  const modal    = document.getElementById('productModal');
  const closeBtn = document.getElementById('modalClose');
  const addBtn   = document.getElementById('modalAddBtn');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (_currentProductId !== null) {
        const product = PRODUCTS.find(p => p.id === _currentProductId);
        if (product) Cart.addItem(product);
        closeModal();
      }
    });
  }
  if (modal) {
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
    }
  });
}

/* ---- GALLERY ---- */
let _galleryCurrentIndex = 0;
let _galleryTouchStartX = 0;
let _galleryInited = false;

function initGallery() {
  renderGallery();
  if (!_galleryInited) {
    setupLightbox();
    _galleryInited = true;
  }
}

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = GALLERY_IMAGES.map((img, i) => `
    <div class="gallery-item" onclick="openLightbox(${i})">
      <img src="${img.src}" alt="${img.alt}" loading="lazy" onerror="this.src='assets/food1.jpg'" />
      <div class="gallery-item-overlay"><i class="fas fa-search-plus"></i></div>
    </div>
  `).join('');
}

function openLightbox(index) {
  _galleryCurrentIndex = index;
  showLightboxImage();
  const lb = document.getElementById('lightbox');
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}

function showLightboxImage() {
  const img     = document.getElementById('lbImg');
  const counter = document.getElementById('lbCounter');
  if (!img || !GALLERY_IMAGES.length) return;
  const item = GALLERY_IMAGES[_galleryCurrentIndex];
  img.src = item.src;
  img.alt = item.alt;
  img.onerror = function() { this.src = 'assets/food1.jpg'; };
  if (counter) counter.textContent = `${_galleryCurrentIndex + 1} / ${GALLERY_IMAGES.length}`;
}

function prevImage() {
  _galleryCurrentIndex = (_galleryCurrentIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  showLightboxImage();
}

function nextImage() {
  _galleryCurrentIndex = (_galleryCurrentIndex + 1) % GALLERY_IMAGES.length;
  showLightboxImage();
}

function setupLightbox() {
  const lb      = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lbClose');
  const prevBtn  = document.getElementById('lbPrev');
  const nextBtn  = document.getElementById('lbNext');
  const lbImg    = document.getElementById('lbImg');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn)  prevBtn.addEventListener('click', prevImage);
  if (nextBtn)  nextBtn.addEventListener('click', nextImage);
  if (lb) {
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  }
  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  prevImage();
    else if (e.key === 'ArrowRight') nextImage();
  });
  if (lbImg) {
    lbImg.addEventListener('touchstart', e => {
      _galleryTouchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lbImg.addEventListener('touchend', e => {
      const diff = _galleryTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { if (diff > 0) nextImage(); else prevImage(); }
    }, { passive: true });
  }
}

/* ---- ORDER ---- */
let _locationLink = '';
let _orderInited  = false;

function initOrder() {
  renderCartSection();
  renderOrderSummary();
  if (!_orderInited) {
    setupLocationBtn();
    setupForm();
    _orderInited = true;
  }
}

function renderCartSection() {
  const listEl   = document.getElementById('cartItemsList');
  const totalRow = document.getElementById('cartTotalRow');
  if (!listEl) return;

  const items = Cart.getItems();
  if (items.length === 0) {
    listEl.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-basket"></i>
        <p>Səbətiniz boşdur</p>
        <button class="btn-primary" onclick="navigateTo('menu')">Menyuya Bax</button>
      </div>`;
    if (totalRow) totalRow.style.display = 'none';
    return;
  }

  listEl.innerHTML = items.map(item => {
    const priceStr = (item.price * item.qty).toFixed(2);
    return `
    <div class="cart-item" id="cart-item-${item.id}">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}"
           onerror="this.src='assets/food1.jpg'" loading="lazy"/>
      <div class="cart-item-info">
        <div class="cart-item-name" title="${item.name}">${item.name}</div>
        <div class="cart-item-price">${priceStr} AZN</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <button class="cart-item-delete" onclick="deleteItem(${item.id})" title="Sil">
        <i class="fas fa-trash"></i>
      </button>
    </div>`;
  }).join('');

  if (totalRow) {
    totalRow.style.display = 'block';
    const totalDisplay = document.getElementById('cartTotalDisplay');
    if (totalDisplay) totalDisplay.textContent = Cart.getTotal().toFixed(2) + ' AZN';
  }
  renderOrderSummary();
}

function changeQty(productId, delta) {
  const items = Cart.getItems();
  const item  = items.find(i => i.id === productId);
  if (!item) return;
  const newQty = item.qty + delta;
  if (newQty < 1) { deleteItem(productId); }
  else { Cart.updateQty(productId, newQty); renderCartSection(); }
}

function deleteItem(productId) {
  Cart.removeItem(productId);
  renderCartSection();
  showToast('Məhsul silindi', 'warning');
}

function renderOrderSummary() {
  const summaryEl = document.getElementById('orderItemsSummary');
  const listEl    = document.getElementById('orderItemsList');
  const totalEl   = document.getElementById('orderTotalSummary');
  const emptyMsg  = document.getElementById('orderEmptyMsg');
  if (!summaryEl) return;

  const items = Cart.getItems();
  if (items.length === 0) {
    summaryEl.style.display = 'none';
    if (emptyMsg) emptyMsg.style.display = 'block';
  } else {
    summaryEl.style.display = 'block';
    if (emptyMsg) emptyMsg.style.display = 'none';
    if (listEl) {
      listEl.innerHTML = items.map(item => `
        <div class="order-summary-item">
          <span>${item.name} × ${item.qty}</span>
          <span>${(item.price * item.qty).toFixed(2)} AZN</span>
        </div>`).join('');
    }
    if (totalEl) totalEl.textContent = Cart.getTotal().toFixed(2) + ' AZN';
  }
}

function setupLocationBtn() {
  const btn       = document.getElementById('getLocBtn');
  const linkInput = document.getElementById('locationLink');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      setLocStatus('Bu cihaz konum dəstəkləmir', 'error'); return;
    }
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gözləyin...';
    setLocStatus('Konum alınır...', '');

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const gmLink = `https://maps.google.com/?q=${lat},${lng}`;
        _locationLink = gmLink;
        if (linkInput) linkInput.value = gmLink;
        setLocStatus('✓ Konum uğurla alındı!', 'success');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-crosshairs"></i> Yenilə';
      },
      err => {
        let msg = 'Konum alınamadı';
        if (err.code === 1) msg = 'İcazə verilmədi. Zəhmət olmasa brauzer icazəsini aktiv edin';
        else if (err.code === 3) msg = 'Zaman aşımı. Yenidən cəhd edin';
        setLocStatus(msg, 'error');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-crosshairs"></i> Yenidən';
      },
      { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
    );
  });
}

function setLocStatus(msg, type) {
  const el = document.getElementById('locStatus');
  if (!el) return;
  el.textContent = msg;
  el.className = 'loc-status' + (type ? ` ${type}` : '');
}

function setupForm() {
  const form = document.getElementById('orderForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm()) return;
    const items = Cart.getItems();
    if (items.length === 0) { showToast('Əvvəlcə məhsul seçin', 'error'); return; }

    const name    = document.getElementById('customerName').value.trim();
    const phone   = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const note    = document.getElementById('orderNote').value.trim();
    const locVal  = document.getElementById('locationLink').value.trim();

    let msg = `🍖 *618 DÖNƏR - YENİ SİFARİŞ*\n\n`;
    msg += `👤 *Ad:* ${name}\n`;
    msg += `📞 *Telefon:* ${phone}\n`;
    msg += `🏠 *Ünvan:* ${address}\n`;
    if (locVal) msg += `📍 *Konum:* ${locVal}\n`;
    msg += `\n🛒 *Sifariş:*\n`;
    items.forEach(item => {
      msg += `  • ${item.name} × ${item.qty} = ${(item.price * item.qty).toFixed(2)} AZN\n`;
    });
    msg += `\n🚚 *Çatdırılma:* Pulsuz`;
    msg += `\n💰 *CƏMİ: ${Cart.getTotal().toFixed(2)} AZN*`;
    if (note) msg += `\n\n📝 *Qeyd:* ${note}`;

    window.open(`https://wa.me/994559406018?text=${encodeURIComponent(msg)}`, '_blank');

    Cart.clear();
    showToast('Sifarişiniz WhatsApp ilə göndərildi!', 'success');
    setTimeout(() => {
      renderCartSection();
      renderOrderSummary();
      form.reset();
      const locInput = document.getElementById('locationLink');
      if (locInput) locInput.value = '';
      _locationLink = '';
      setLocStatus('', '');
    }, 800);
  });
}

function validateForm() {
  let valid = true;
  const fields = [
    { id:'customerName',    errId:'nameError',    label:'Ad Soyad' },
    { id:'customerPhone',   errId:'phoneError',   label:'Telefon'  },
    { id:'customerAddress', errId:'addressError', label:'Ünvan'    }
  ];
  fields.forEach(f => {
    const input = document.getElementById(f.id);
    const errEl = document.getElementById(f.errId);
    const val   = input ? input.value.trim() : '';
    if (!val) {
      if (errEl)  errEl.textContent = `${f.label} doldurulması məcburidir`;
      if (input)  input.classList.add('error');
      valid = false;
    } else {
      if (errEl)  errEl.textContent = '';
      if (input)  input.classList.remove('error');
    }
  });
  const phoneInput = document.getElementById('customerPhone');
  const phoneErr   = document.getElementById('phoneError');
  if (phoneInput && phoneInput.value.trim()) {
    const cleaned = phoneInput.value.replace(/\s/g, '');
    if (cleaned.length < 7) {
      if (phoneErr) phoneErr.textContent = 'Düzgün telefon nömrəsi daxil edin';
      phoneInput.classList.add('error');
      valid = false;
    }
  }
  return valid;
}

/* ---- ABOUT ---- */
let _aboutInited = false;
function initAbout() {
  if (_aboutInited) return;
  _aboutInited = true;
  checkWorkingHours();
}

function checkWorkingHours() {
  const statusEl = document.getElementById('currentStatus');
  if (!statusEl) return;
  const now     = new Date();
  const day     = now.getDay();
  const timeVal = now.getHours() * 60 + now.getMinutes();
  let openMin, closeMin;
  if (day === 0)      { openMin = 11*60; closeMin = 22*60; }
  else if (day >= 5)  { openMin = 10*60; closeMin = 23*60; }
  else                { openMin = 10*60; closeMin = 22*60; }
  const isOpen = timeVal >= openMin && timeVal < closeMin;
  statusEl.textContent  = isOpen ? '✓ Hazırda açığıq!' : '✗ Hazırda bağlıyıq';
  statusEl.style.color  = isOpen ? '#27ae60' : '#e74c3c';
  statusEl.style.fontWeight = '700';
}

/* ---- FAQ ---- */
let _faqInited = false;
function initFaq() {
  if (_faqInited) return;
  _faqInited = true;
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn    = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;
    btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('open');
      items.forEach(i => {
        i.querySelector('.faq-q')?.classList.remove('open');
        i.querySelector('.faq-a')?.classList.remove('open');
      });
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    });
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();

  // Determine initial page from hash
  const hash = window.location.hash.replace('#', '');
  const startPage = pages.includes(hash) ? hash : 'home';
  navigateTo(startPage, false);

  // Handle browser back/forward
  window.addEventListener('popstate', e => {
    const page = (e.state && e.state.page) || 'home';
    navigateTo(page, false);
  });
});

/* ============================================================
   GLOBAL EXPOSE (for inline onclick attributes)
   ============================================================ */
window.PRODUCTS        = PRODUCTS;
window.GALLERY_IMAGES  = GALLERY_IMAGES;
window.Cart            = Cart;
window.showToast       = showToast;
window.navigateTo      = navigateTo;
window.openProductModal= openProductModal;
window.openModal       = openModal;
window.closeModal      = closeModal;
window.addToCartFromMenu = addToCartFromMenu;
window.openLightbox    = openLightbox;
window.closeLightbox   = closeLightbox;
window.prevImage       = prevImage;
window.nextImage       = nextImage;
window.changeQty       = changeQty;
window.deleteItem      = deleteItem;
