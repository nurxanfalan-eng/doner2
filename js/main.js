/**
 * 618 DONER - HOME PAGE JS
 */
document.addEventListener('DOMContentLoaded', () => {
  renderPopular();
});

function renderPopular() {
  const grid = document.getElementById('popularGrid');
  if (!grid) return;
  const popular = PRODUCTS.filter(p => p.popular).slice(0, 4);
  grid.innerHTML = popular.map(p => createProductCard(p)).join('');
}

function createProductCard(p) {
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

function openProductModal(id) {
  window.location.href = `menu.html#product-${id}`;
}
