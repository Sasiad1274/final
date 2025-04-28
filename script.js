// script.js — Elegance Perfume

/* ========== MOBILE NAVIGATION ========== */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 600) navLinks.classList.remove('open');
  });
}

/* ========== SMOOTH SCROLL (for anchor links) ========== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.length > 1 && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      if (navLinks) navLinks.classList.remove('open');
    }
  });
});

/* ========== CART LOGIC ========== */
const sampleProducts = [
  // Men's Perfumes
  { id: 1, name: "Dior Sauvage Elixir", price: 20670, img: "images/dior-sauvage-elixir.jpg", category: "Men" },
  { id: 2, name: "Bleu de Chanel Eau de Toilette", price: 17550, img: "images/bleu-de-chanel.jpg", category: "Men" },
  { id: 3, name: "Tom Ford Noir Extreme Parfum", price: 31200, img: "images/tom-ford-noir.jpg", category: "Men" },
  { id: 4, name: "Azzaro The Most Wanted Eau de Parfum", price: 16900, img: "images/azzaro-most-wanted.jpg", category: "Men" },

  // Women's Perfumes
  { id: 5, name: "Dior J'adore l'Or Essence de Parfum", price: 20800, img: "images/dior-jadore.jpg", category: "Women" },
  { id: 6, name: "Carolina Herrera Good Girl Eau de Parfum", price: 11570, img: "images/carolina-herrera-good-girl.jpg", category: "Women" },
  { id: 7, name: "Maison Francis Kurkdjian Baccarat Rouge 540", price: 42250, img: "images/baccarat-rouge.jpg", category: "Women" },
  { id: 8, name: "Narciso Rodriguez For Her Eau de Parfum", price: 13000, img: "images/narciso-rodriguez.jpg", category: "Women" },
  { id: 9, name: "Yves Saint Laurent Libre Intense", price: 16900, img: "images/ysl-libre-intense.jpg", category: "Women" },

  // Unisex Perfumes
  { id: 10, name: "Le Labo Santal 33", price: 35100, img: "images/le-labo-santal.jpg", category: "Unisex" },
  { id: 11, name: "Tom Ford Lost Cherry", price: 50700, img: "images/tom-ford-lost-cherry.jpg", category: "Unisex" },
  { id: 12, name: "Escentric Molecules Molecule 01", price: 13000, img: "images/molecule-01.jpg", category: "Unisex" },
  { id: 13, name: "Creed Silver Mountain Water", price: 57850, img: "images/creed-silver-mountain.jpg", category: "Unisex" },
  { id: 14, name: "Initio Side Effect", price: 40300, img: "images/initio-side-effect.jpg", category: "Unisex" },

  // Luxury Perfumes
  { id: 15, name: "Frédéric Malle Portrait of a Lady", price: 31070, img: "images/portrait-of-a-lady.jpg", category: "Luxury" },
  { id: 16, name: "Byredo Mojave Ghost", price: 29900, img: "images/mojave-ghost.jpg", category: "Luxury" },
  { id: 17, name: "Maison Francis Kurkdjian Baccarat Rouge 540", price: 42250, img: "images/baccarat-rouge.jpg", category: "Luxury" },
  { id: 18, name: "Creed Aventus", price: 64350, img: "images/creed-aventus.jpg", category: "Luxury" },
  { id: 19, name: "Diptyque Philosykos", price: 19500, img: "images/philosykos.jpg", category: "Luxury" }
];

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function addToCart(productId) {
  let cart = getCart();
  const prod = sampleProducts.find(p => p.id === productId);
  let found = cart.find(item => item.id === prod.id);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ ...prod, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  alert("Added to cart!");
}
function updateCartQty(productId, qty) {
  let cart = getCart();
  qty = Math.max(1, Number(qty));
  cart = cart.map(item => item.id === productId ? { ...item, qty } : item);
  saveCart(cart);
  renderCart();
}
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
  updateCartCount();
}
function clearCart() {
  localStorage.removeItem('cart');
  renderCart();
  updateCartCount();
}
function updateCartCount() {
  const count = getCart().reduce((sum, it) => sum + it.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count > 0 ? count : '');
}

/* ========== CART PAGE RENDER ========== */
function renderCart() {
  const cartTable = document.querySelector('.cart-table tbody');
  const summary = document.querySelector('.cart-summary');
  const empty = document.querySelector('.cart-empty');
  if (!cartTable || !summary || !empty) return;
  const cart = getCart();
  cartTable.innerHTML = '';
  let total = 0;
  if (cart.length === 0) {
    empty.style.display = '';
    summary.textContent = '';
    return;
  }
  empty.style.display = 'none';
  cart.forEach(item => {
    total += item.price * item.qty;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${item.img}" alt="${item.name}" class="cart-product-img"></td>
      <td>${item.name}</td>
      <td>ETB ${item.price.toLocaleString()}</td>
      <td>
        <input type="number" class="cart-qty-input" min="1" value="${item.qty}" data-id="${item.id}">
      </td>
      <td>ETB ${(item.price * item.qty).toLocaleString()}</td>
      <td>
        <button class="cart-remove-btn" data-id="${item.id}">Remove</button>
      </td>
    `;
    cartTable.appendChild(tr);
  });
  summary.textContent = `Total: ETB ${total.toLocaleString()}`;
  // Events
  cartTable.querySelectorAll('.cart-qty-input').forEach(input => {
    input.addEventListener('change', function () {
      updateCartQty(Number(this.dataset.id), this.value);
    });
  });
  cartTable.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      removeFromCart(Number(this.dataset.id));
    });
  });
}

/* ========== PRODUCTS PAGE LOGIC ========== */
function renderProducts() {
  const productSections = document.querySelectorAll('.products-section');
  productSections.forEach(section => {
    const category = section.id.replace('-perfumes', ''); // Extract category from section ID
    const products = sampleProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    const grid = section.querySelector('.products-grid');
    if (!grid) return;

    grid.innerHTML = ''; // Clear existing products

    if (products.length === 0) {
      grid.innerHTML = `<p class="no-products">No products available in this category.</p>`;
      return;
    }

    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('product-card');
      card.innerHTML = `
        <img src="${product.img}" alt="${product.name}" class="product-img">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">ETB ${product.price.toLocaleString()}</p>
        <button class="product-add-btn" data-id="${product.id}">Add to Cart</button>
      `;
      grid.appendChild(card);
    });
  });

  // Attach event listeners to Add to Cart buttons for all categories
  document.querySelectorAll('.product-add-btn').forEach(button => {
    button.addEventListener('click', () => {
      const productId = Number(button.dataset.id);
      addToCart(productId);
    });
  });
}

/* ========== PAYMENT PAGE ========== */
function paymentPageInit() {
  const methods = document.querySelectorAll('.payment-method');
  const forms = document.querySelectorAll('.payment-form');
  methods.forEach((m, idx) => {
    m.addEventListener('click', () => {
      methods.forEach(x => x.classList.remove('selected'));
      m.classList.add('selected');
      forms.forEach(f => f.classList.remove('active'));
      forms[idx].classList.add('active');
    });
  });
  // Form validation and redirect
  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const valid = Array.from(form.querySelectorAll('input[required]'))
        .every(inp => inp.value.trim() !== '');
      if (!valid) {
        alert('Please fill all fields.');
        return;
      }
      // Save order summary for confirmation page
      localStorage.setItem('order', JSON.stringify({
        payment: form.dataset.method,
        cart: getCart(),
        total: getCart().reduce((sum, it) => sum + it.price * it.qty, 0)
      }));
      clearCart();
      window.location.href = 'confirmation.html';
    });
  });
}

/* ========== CONFIRMATION PAGE ========== */
function confirmationPageInit() {
  const summary = document.querySelector('.confirm-summary');
  if (!summary) return;
  const order = JSON.parse(localStorage.getItem('order'));
  if (!order) {
    summary.textContent = "No order found.";
    return;
  }
  summary.innerHTML = `
    <b>Payment Method:</b> ${order.payment} <br>
    <b>Ordered items:</b>
    <ul style="margin: .7rem 0 0 0; padding: 0 0 0 1.1rem;">
      ${order.cart.map(it => `<li>${it.name} x ${it.qty} (ETB ${(it.price * it.qty).toLocaleString()})</li>`).join('')}
    </ul>
    <br>
    <b>Total Paid:</b> ETB ${order.total.toLocaleString()}
  `;
  document.querySelectorAll('.confirm-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = btn.dataset.href;
    });
  });
  localStorage.removeItem('order');
}

/* ========== FAQ ACCORDION ========== */
function faqInit() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      document.querySelectorAll('.faq-item').forEach(i => i !== item && i.classList.remove('active'));
      item.classList.toggle('active');
    });
  });
}

/* ========== INITIALIZE (ON PAGE LOAD) ========== */
document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();

  if (document.querySelector('.cart-table')) renderCart();
  if (document.querySelector('.products-grid')) renderProducts();
  if (document.querySelector('.payment-methods')) paymentPageInit();
  if (document.querySelector('.confirm-section')) confirmationPageInit();
  if (document.querySelector('.faq-section')) faqInit();

  // Cart page buttons
  const clearBtn = document.querySelector('.clear-cart-btn');
  if (clearBtn) clearBtn.addEventListener('click', clearCart);
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
    if (getCart().length === 0) {
      alert("Your cart is empty!");
      return;
    }
    window.location.href = 'payment.html';
  });
});