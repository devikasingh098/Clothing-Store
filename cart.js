// js/cart.js

// Get cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update badge count
window.updateCartCount = function() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = cart.length;
  }
}

// Add product to cart
window.addToCart = function(item) {
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${item.name} added to cart!`);
}

// Display items in modal
window.displayCartItems = function(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p class="text-gray-500">Your cart is empty.</p>';
    return;
  }

  let html = '<ul class="space-y-2">';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    html += `
      <li class="flex justify-between items-center border-b pb-2">
        ${item.name} - Rs. ${item.price}
        <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700">Remove</button>
      </li>
    `;
  });

  html += '</ul>';
  html += `<p class="mt-4 font-bold">Total: Rs. ${total}</p>`;
  container.innerHTML = html;
}

// Remove item
window.removeFromCart = function(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  displayCartItems('cart-items');
}

// Always update when page loads
updateCartCount();