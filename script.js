const products = [
  {
    name: 'Manette PS5',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1606813901371-9e1b1a92b5c2?auto=format&fit=crop&w=400&q=80',
    reviews: []
  },
  {
    name: 'Clavier RGB',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1587206661321-91f5d11972e2?auto=format&fit=crop&w=400&q=80',
    reviews: []
  },
  {
    name: 'Souris Gaming',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1606813901587-57915cf0b08d?auto=format&fit=crop&w=400&q=80',
    reviews: []
  },
  {
    name: 'Chaise Gaming',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80',
    reviews: []
  }
];

let cart = [];
let currentUser = null;

const productList = document.getElementById('product-list');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const totalPrice = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout');
const search = document.getElementById('search');

function renderProducts(filter = '') {
  productList.innerHTML = '';
  products
    .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(p => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <img src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>${p.price.toFixed(2)} €</p>
        <button onclick="addToCart('${p.name}')">Ajouter au panier</button>
        <div class="review">
          <p><strong>Avis :</strong></p>
          <div>${renderReviews(p)}</div>
          ${currentUser ? `
            <input type="number" min="1" max="5" id="rate-${p.name}" placeholder="Note /5" />
            <input type="text" id="comment-${p.name}" placeholder="Votre avis..." />
            <button onclick="addReview('${p.name}')">Envoyer</button>
          ` : `<p>Connectez-vous pour noter ce produit.</p>`}
        </div>
      `;
      productList.appendChild(div);
    });
}

function renderReviews(product) {
  if (!product.reviews.length) return "<em>Aucun avis.</em>";
  return product.reviews.map(r => `<p>⭐ ${r.rating}/5 - ${r.text}</p>`).join('');
}

function addReview(productName) {
  const product = products.find(p => p.name === productName);
  const rating = parseInt(document.getElementById(`rate-${productName}`).value);
  const comment = document.getElementById(`comment-${productName}`).value;

  if (rating >= 1 && rating <= 5 && comment.trim()) {
    product.reviews.push({ rating, text: comment });
    renderProducts(search.value);
  } else {
    alert("Note de 1 à 5 + commentaire requis.");
  }
}

function addToCart(name) {
  const item = products.find(p => p.name === name);
  cart.push(item);
  updateCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<li>Panier vide.</li>';
    checkoutBtn.disabled = true;
    totalPrice.textContent = '';
    cartCount.textContent = 0;
    return;
  }

  cart.forEach((item, i) => {
    total += item.price;
    const li = document.createElement('li');
    li.innerHTML = `${item.name} - ${item.price.toFixed(2)} €
      <button onclick="removeItem(${i})">❌</button>`;
    cartItems.appendChild(li);
  });

  totalPrice.textContent = `Total : ${total.toFixed(2)} €`;
  cartCount.textContent = cart.length;
  checkoutBtn.disabled = false;
}

checkoutBtn.onclick = () => {
  alert("Commande confirmée ! Merci.");
  cart = [];
  updateCart();
};

document.getElementById('toggle-theme').onclick = () => {
  document.body.classList.toggle('light');
};

search.oninput = (e) => {
  renderProducts(e.target.value);
};

document.getElementById('auth-toggle').onclick = () => {
  document.getElementById('auth-section').classList.toggle('hidden');
};

document.getElementById('login-btn').onclick = () => {
  const user = document.getElementById('auth-username').value;
  const pass = document.getElementById('auth-password').value;
  if (user && pass) {
    currentUser = user;
    document.getElementById('user-info').textContent = `👤 ${currentUser}`;
    document.getElementById('auth-section').classList.add('hidden');
    renderProducts(search.value);
  } else {
    alert("Veuillez entrer vos identifiants.");
  }
};

document.getElementById('register-btn').onclick = () => {
  alert("Inscription réussie (simulée). Connectez-vous maintenant.");
};

renderProducts();
updateCart();
// Variable pour admin
let isAdmin = false;

// Toggle affichage admin
const adminSection = document.getElementById('admin-section');
const adminLoginBtn = document.getElementById('admin-login-toggle');
const adminLogoutBtn = document.getElementById('admin-logout');
const adminProductList = document.getElementById('admin-product-list');
const adminAddBtn = document.getElementById('admin-add-product');

adminLoginBtn.onclick = () => {
  const pass = prompt("Mot de passe admin ?");
  if (pass === "admin123") { // mot de passe simple à changer
    isAdmin = true;
    adminSection.classList.remove('hidden');
    document.getElementById('auth-section').classList.add('hidden');
    adminLoginBtn.style.display = 'none';
    renderAdminProducts();
    alert("Bienvenue Admin !");
  } else {
    alert("Mot de passe incorrect.");
  }
};

adminLogoutBtn.onclick = () => {
  isAdmin = false;
  adminSection.classList.add('hidden');
  adminLoginBtn.style.display = 'inline-block';
};

// Fonction pour afficher produits dans admin
function renderAdminProducts() {
  adminProductList.innerHTML = '';
  products.forEach((p, i) => {
    const li = document.createElement('li');
    li.textContent = `${p.name} - ${p.price.toFixed(2)} €`;
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Supprimer';
    delBtn.onclick = () => {
      if (confirm(`Supprimer ${p.name} ?`)) {
        products.splice(i, 1);
        renderAdminProducts();
        renderProducts(search.value);
        updateCart();
      }
    };
    li.appendChild(delBtn);
    adminProductList.appendChild(li);
  });
}

// Ajouter produit via admin
adminAddBtn.onclick = () => {
  const name = document.getElementById('admin-product-name').value.trim();
  const price = parseFloat(document.getElementById('admin-product-price').value);
  const image = document.getElementById('admin-product-image').value.trim();

  if (!name || isNaN(price) || !image) {
    alert("Tous les champs sont requis.");
    return;
  }

  products.push({name, price, image, reviews: []});
  renderAdminProducts();
  renderProducts(search.value);

  // Reset form
  document.getElementById('admin-product-name').value = '';
  document.getElementById('admin-product-price').value = '';
  document.getElementById('admin-product-image').value = '';
  alert(`Produit "${name}" ajouté !`);
};
const orderHistorySection = document.getElementById('order-history');
const orderList = document.getElementById('order-list');

// Récupérer historique d’un user depuis localStorage
function getOrderHistory(username) {
  const data = localStorage.getItem('orders_' + username);
  return data ? JSON.parse(data) : [];
}

// Sauvegarder une commande
function saveOrder(username, order) {
  const history = getOrderHistory(username);
  history.push(order);
  localStorage.setItem('orders_' + username, JSON.stringify(history));
}

// Afficher historique
function renderOrderHistory() {
  if (!currentUser) {
    orderHistorySection.classList.add('hidden');
    return;
  }
  const orders = getOrderHistory(currentUser);
  orderHistorySection.classList.remove('hidden');
  orderList.innerHTML = '';

  if (orders.length === 0) {
    orderList.innerHTML = '<li>Aucune commande.</li>';
    return;
  }

  orders.forEach((order, i) => {
    const li = document.createElement('li');
    const date = new Date(order.date).toLocaleString();
    const items = order.items.map(it => it.name).join(', ');
    li.textContent = `Commande du ${date} — Produits: ${items} — Total: ${order.total.toFixed(2)} €`;
    orderList.appendChild(li);
  });
}

// Modifie la fonction de paiement simulé pour sauvegarder la commande
checkoutBtn.onclick = () => {
  if (!currentUser) {
    alert("Vous devez être connecté pour commander.");
    return;
  }
  if (cart.length === 0) {
    alert("Votre panier est vide.");
    return;
  }
  const total = cart.reduce((sum, i) => sum + i.price, 0);
  const order = {
    date: new Date().toISOString(),
    items: [...cart],
    total
  };
  saveOrder(currentUser, order);
  alert("Commande confirmée ! Merci.");
  cart = [];
  updateCart();
  renderOrderHistory();
};

// Met à jour l’historique à la connexion utilisateur
document.getElementById('login-btn').onclick = () => {
  const user = document.getElementById('auth-username').value;
  const pass = document.getElementById('auth-password').value;
  if (user && pass) {
    currentUser = user;
    document.getElementById('user-info').textContent = `👤 ${currentUser}`;
    document.getElementById('auth-section').classList.add('hidden');
    renderProducts(search.value);
    renderOrderHistory(); // <== affiche historique
  } else {
    alert("Veuillez entrer vos identifiants.");
  }
};
