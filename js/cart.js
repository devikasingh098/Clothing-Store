// cart.js — shared cart logic for Devika's Clothing Store

function getCart() {
  return JSON.parse(localStorage.getItem('devikaCart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('devikaCart', JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: product.name, price: product.price, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  showToast(product.name + ' added to cart!');
}

function removeFromCart(name) {
  let cart = getCart().filter(item => item.name !== name);
  saveCart(cart);
  updateCartCount();
  displayCartItems('cart-items');
}

function changeQty(name, delta) {
  const cart = getCart();
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(name);
    return;
  }
  saveCart(cart);
  updateCartCount();
  displayCartItems('cart-items');
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = total);
}

function displayCartItems(containerId) {
  const cart = getCart();
  const container = document.getElementById(containerId);
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p class="text-center text-muted my-3">Your cart is empty.</p>';
    return;
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  container.innerHTML = `
    <table class="table align-middle">
      <thead>
        <tr>
          <th>Item</th>
          <th class="text-center">Qty</th>
          <th class="text-end">Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${cart.map(item => `
          <tr>
            <td>${item.name}</td>
            <td class="text-center">
              <div class="d-flex align-items-center justify-content-center gap-2">
                <button class="btn btn-sm btn-outline-secondary" onclick="changeQty('${item.name}', -1)">−</button>
                <span>${item.qty}</span>
                <button class="btn btn-sm btn-outline-secondary" onclick="changeQty('${item.name}', 1)">+</button>
              </div>
            </td>
            <td class="text-end">Rs. ${(item.price * item.qty).toLocaleString()}/-</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${item.name}')">✕</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2"><strong>Total</strong></td>
          <td class="text-end" colspan="2"><strong>Rs. ${total.toLocaleString()}/-</strong></td>
        </tr>
      </tfoot>
    </table>
    <div class="d-flex justify-content-between mt-2">
      <button class="btn btn-outline-danger btn-sm" onclick="clearCart()">Clear Cart</button>
      <button class="btn btn-success btn-sm" onclick="checkout()">Checkout →</button>
    </div>
  `;
}

function clearCart() {
  saveCart([]);
  updateCartCount();
  displayCartItems('cart-items');
}

function checkout() {
  alert('Thank you for shopping at Devika\'s Clothing Store! 🛍️\nYour order has been placed.');
  clearCart();
  const modal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
  if (modal) modal.hide();
}

function showToast(message) {
  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      background: #198754; color: white; padding: 12px 20px;
      border-radius: 8px; font-size: 14px; font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = '✓ ' + message;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}
