/**
 * 618 DONER - ORDER PAGE JS
 * Cart display + form + geolocation + WhatsApp submit
 */

let locationLink = '';

document.addEventListener('DOMContentLoaded', () => {
  renderCartSection();
  renderOrderSummary();
  setupLocationBtn();
  setupForm();
});

/* ---- RENDER CART ---- */
function renderCartSection() {
  const listEl = document.getElementById('cartItemsList');
  const totalRow = document.getElementById('cartTotalRow');
  if (!listEl) return;

  const items = Cart.getItems();

  if (items.length === 0) {
    listEl.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-basket"></i>
        <p>Səbətiniz boşdur</p>
        <a href="menu.html" class="btn-primary">Menyuya Bax</a>
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
  const item = items.find(i => i.id === productId);
  if (!item) return;
  const newQty = item.qty + delta;
  if (newQty < 1) {
    deleteItem(productId);
  } else {
    Cart.updateQty(productId, newQty);
    renderCartSection();
  }
}

function deleteItem(productId) {
  Cart.removeItem(productId);
  renderCartSection();
  showToast('Məhsul silindi', 'warning');
}

/* ---- ORDER SUMMARY IN FORM ---- */
function renderOrderSummary() {
  const summaryEl = document.getElementById('orderItemsSummary');
  const listEl = document.getElementById('orderItemsList');
  const totalEl = document.getElementById('orderTotalSummary');
  const emptyMsg = document.getElementById('orderEmptyMsg');

  const items = Cart.getItems();
  if (!summaryEl) return;

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

/* ---- GEOLOCATION ---- */
function setupLocationBtn() {
  const btn = document.getElementById('getLocBtn');
  const statusEl = document.getElementById('locStatus');
  const linkInput = document.getElementById('locationLink');

  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      setLocStatus('Bu cihaz konum dəstəkləmir', 'error');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gözləyin...';
    setLocStatus('Konum alınır...', '');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        // Google Maps link format
        const gmLink = `https://maps.google.com/?q=${lat},${lng}`;
        locationLink = gmLink;
        if (linkInput) linkInput.value = gmLink;
        setLocStatus('✓ Konum uğurla alındı!', 'success');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-crosshairs"></i> Yenilə';
      },
      (err) => {
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

/* ---- FORM SUBMIT ---- */
function setupForm() {
  const form = document.getElementById('orderForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const items = Cart.getItems();
    if (items.length === 0) {
      showToast('Əvvəlcə məhsul seçin', 'error');
      return;
    }

    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const note = document.getElementById('orderNote').value.trim();
    const locVal = document.getElementById('locationLink').value.trim();

    // Build WhatsApp message
    let msg = `🍖 *618 DÖNƏR - YENİ SİFARİŞ*\n\n`;
    msg += `👤 *Ad:* ${name}\n`;
    msg += `📞 *Telefon:* ${phone}\n`;
    msg += `🏠 *Ünvan:* ${address}\n`;
    if (locVal) msg += `📍 *Konum:* ${locVal}\n`;
    msg += `\n🛒 *Sifariş:*\n`;
    items.forEach(item => {
      const line = `  • ${item.name} × ${item.qty} = ${(item.price * item.qty).toFixed(2)} AZN`;
      msg += line + '\n';
    });
    msg += `\n🚚 *Çatdırılma:* Pulsuz`;
    msg += `\n💰 *CƏMİ: ${Cart.getTotal().toFixed(2)} AZN*`;
    if (note) msg += `\n\n📝 *Qeyd:* ${note}`;

    const encoded = encodeURIComponent(msg);
    const waUrl = `https://wa.me/994559406018?text=${encoded}`;

    // Open WhatsApp
    window.open(waUrl, '_blank');

    // Clear cart after order
    Cart.clear();
    showToast('Sifarişiniz WhatsApp ilə göndərildi!', 'success');
    setTimeout(() => {
      renderCartSection();
      renderOrderSummary();
      form.reset();
      document.getElementById('locationLink').value = '';
      locationLink = '';
      setLocStatus('', '');
    }, 800);
  });
}

function validateForm() {
  let valid = true;
  const fields = [
    { id: 'customerName', errId: 'nameError', label: 'Ad Soyad' },
    { id: 'customerPhone', errId: 'phoneError', label: 'Telefon' },
    { id: 'customerAddress', errId: 'addressError', label: 'Ünvan' }
  ];

  fields.forEach(f => {
    const input = document.getElementById(f.id);
    const errEl = document.getElementById(f.errId);
    const val = input ? input.value.trim() : '';
    if (!val) {
      if (errEl) errEl.textContent = `${f.label} doldurulması məcburidir`;
      if (input) input.classList.add('error');
      valid = false;
    } else {
      if (errEl) errEl.textContent = '';
      if (input) input.classList.remove('error');
    }
  });

  // Phone basic validation
  const phoneInput = document.getElementById('customerPhone');
  const phoneErr = document.getElementById('phoneError');
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

// Expose for inline calls
window.changeQty = changeQty;
window.deleteItem = deleteItem;
