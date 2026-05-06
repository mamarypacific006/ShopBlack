// Shop Black - renderização de produtos, lojas e painel de edição
const productsGrid = document.getElementById('productGrid');
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const adminLoginButton = document.getElementById('adminLogin');
const categoryCount = document.getElementById('categoryCount');
const categoryTabs = document.querySelectorAll('.product-category-tabs button');
const adminForm = document.getElementById('adminForm');
const productCategoryInput = document.getElementById('productCategory');
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const productImageInput = document.getElementById('productImage');
const productDescriptionInput = document.getElementById('productDescription');
const productLinkInput = document.getElementById('productLink');
const saveButton = document.getElementById('saveButton');
const cancelEditButton = document.getElementById('cancelEdit');
const deleteButton = document.getElementById('deleteButton');
const editorPanel = document.getElementById('editorPanel');
const adminPrompt = document.getElementById('adminPrompt');
const logoutAdminButton = document.getElementById('logoutAdmin');

const MAX_PRODUCTS = 100;
let activeCategory = 'mercado';
let editProductId = null;
let editCategory = null;
let isDarkMode = false;
let adminMode = false;
const ADMIN_PASSWORD = 'M@ria007';

const categories = {
  mercado: {
    title: 'Achadinhos do Mercado Pago',
    products: [
      {
        id: crypto.randomUUID(),
        name: 'Fone Bluetooth com Cancelamento de Ruído',
        price: 249.9,
        image: 'https://images.unsplash.com/photo-1517059224940-d4af9eec41e8?auto=format&fit=crop&w=900&q=80',
        description: 'Aproveite música e chamadas com som cristalino, perfeito para o dia a dia.',
        store: 'Mercado Pago',
        link: 'https://www.mercadopago.com.br'
      },
      {
        id: crypto.randomUUID(),
        name: 'Cafeteira Elétrica Compacta',
        price: 179.9,
        image: 'https://images.unsplash.com/photo-1509475826633-fed577a2c71b?auto=format&fit=crop&w=900&q=80',
        description: 'Café fresco em minutos para seus dias mais produtivos.',
        store: 'Mercado Pago',
        link: 'https://www.mercadopago.com.br'
      },
      {
        id: crypto.randomUUID(),
        name: 'Smartwatch Fitness',
        price: 299.9,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
        description: 'Monitore sua saúde e atividades diárias com este smartwatch avançado.',
        store: 'Mercado Pago',
        link: 'https://www.mercadopago.com.br'
      },
      {
        id: crypto.randomUUID(),
        name: 'Mochila Executiva',
        price: 89.9,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
        description: 'Mochila resistente e elegante para o trabalho ou viagens.',
        store: 'Mercado Pago',
        link: 'https://www.mercadopago.com.br'
      },
      {
        id: crypto.randomUUID(),
        name: 'Aspirador de Pó Robô',
        price: 499.9,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
        description: 'Limpeza automática da sua casa com tecnologia inteligente.',
        store: 'Mercado Pago',
        link: 'https://www.mercadopago.com.br'
      }
    ]
  },
  shopee: {
    title: 'Shopee',
    products: [
      {
        id: crypto.randomUUID(),
        name: 'Tênis esportivo masculino',
        price: 139.9,
        image: 'https://images.unsplash.com/photo-1528701800489-20f5ae3ce8aa?auto=format&fit=crop&w=900&q=80',
        description: 'Conforto e estilo para treinos e passeios.',
        store: 'Shopee',
        link: 'https://shopee.com.br'
      },
      {
        id: crypto.randomUUID(),
        name: 'Capa para celular com efeito mate',
        price: 39.9,
        image: 'https://images.unsplash.com/photo-1512499617640-c2f999fe5877?auto=format&fit=crop&w=900&q=80',
        description: 'Proteção elegante para o seu smartphone.',
        store: 'Shopee',
        link: 'https://shopee.com.br'
      }
    ]
  }
};

const defaultStores = [
  {
    id: crypto.randomUUID(),
    name: 'Shopee Brasil',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkg7tCvMoyEj53Q2izcbj8frD1KgeYJq23Kw&s',
    description: 'A maior loja online da Ásia, agora no Brasil com frete grátis e milhões de produtos.',
    category: 'Marketplace',
    link: 'https://shopee.com.br'
  },
  {
    id: crypto.randomUUID(),
    name: 'Mercado Livre',
    logo: 'https://cdn.shopify.com/app-store/listing_images/71ecb1758a5c85014ad8353f3ac28b65/icon/CJLj5azbsI0DEAE=.png',
    description: 'O maior marketplace da América Latina com garantia de entrega e proteção ao comprador.',
    category: 'Marketplace',
    link: 'https://mercadolivre.com.br'
  }
];

function formatPrice(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function loadTheme() {
  const savedTheme = localStorage.getItem('shophub_theme');
  isDarkMode = savedTheme === 'dark';
  applyTheme();
}

function applyTheme() {
  if (isDarkMode) {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = '☀️';
    localStorage.setItem('shophub_theme', 'dark');
  } else {
    document.body.classList.remove('dark-theme');
    themeToggle.textContent = '🌙';
    localStorage.setItem('shophub_theme', 'light');
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadAdminState() {
  const savedAdmin = localStorage.getItem('shophub_admin');
  adminMode = savedAdmin === 'true';
  updateAdminAccess();
}

function updateAdminAccess() {
  if (adminMode) {
    adminLoginButton.textContent = 'Logout AD';
    if (editorPanel) editorPanel.classList.remove('hidden');
    if (adminPrompt) adminPrompt.classList.add('hidden');
    if (logoutAdminButton) logoutAdminButton.style.display = 'block';
  } else {
    adminLoginButton.textContent = 'AD';
    if (editorPanel) editorPanel.classList.add('hidden');
    if (adminPrompt) adminPrompt.classList.remove('hidden');
    if (logoutAdminButton) logoutAdminButton.style.display = 'none';
    clearForm();
  }
}

function requestAdminLogin() {
  if (adminMode) {
    adminMode = false;
    localStorage.removeItem('shophub_admin');
    updateAdminAccess();
    renderProducts();
    return;
  }

  const password = prompt('Digite a senha de administrador:');
  if (password === ADMIN_PASSWORD) {
    adminMode = true;
    localStorage.setItem('shophub_admin', 'true');
    updateAdminAccess();
    renderProducts();
    alert('Acesso de administrador ativado. Agora você pode editar produtos.');
  } else {
    alert('Senha incorreta. Acesso negado.');
  }
}

function loadState() {
  const savedData = localStorage.getItem('shophub_categories');
  if (!savedData) return;
  try {
    const parsed = JSON.parse(savedData);
    if (parsed && parsed.mercado && parsed.shopee) {
      categories.mercado.products = parsed.mercado.products || categories.mercado.products;
      categories.shopee.products = parsed.shopee.products || categories.shopee.products;
    }
  } catch (error) {
    console.warn('Falha ao carregar estado do localStorage:', error);
  }
}

function saveState() {
  localStorage.setItem('shophub_categories', JSON.stringify(categories));
}

function getProducts(category) {
  return categories[category] ? categories[category].products : [];
}

function updateCategoryCount() {
  const currentProducts = getProducts(activeCategory);
  const remaining = MAX_PRODUCTS - currentProducts.length;
  categoryCount.textContent = `${categories[activeCategory].title}: ${currentProducts.length} produto${currentProducts.length === 1 ? '' : 's'} • ${remaining} espaço${remaining === 1 ? '' : 's'} restante${remaining === 1 ? '' : 's'}`;
  saveButton.disabled = remaining <= 0 && !editProductId;
}

function setActiveCategory(category) {
  activeCategory = category;
  categoryTabs.forEach((button) => {
    button.classList.toggle('active', button.dataset.category === category);
  });
  if (productCategoryInput) {
    productCategoryInput.value = category;
  }
  renderProducts();
  updateCategoryCount();
}

function renderProducts() {
  if (!productsGrid) return;

  const productList = getProducts(activeCategory);
  productsGrid.innerHTML = '';

  if (productList.length === 0) {
    productsGrid.innerHTML = '<p>Não há produtos cadastrados nesta categoria ainda.</p>';
    return;
  }

  const productsToShow = productList;

  productsToShow.forEach((product, index) => {
    const card = document.createElement('article');
    card.className = `product-card ${index < 3 ? 'featured' : ''}`;
    card.innerHTML = `
      <div class="product-media">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="store-info">
          <small>Vendido por: ${product.store}</small>
        </div>
        <div class="product-meta">
          <span class="price-tag">${formatPrice(product.price)}</span>
          <div class="product-actions">
            ${product.link ? `<button type="button" class="buy-btn" onclick="window.open('${product.link}', '_blank')">Comprar</button>` : ''}
            ${adminMode ? `<button type="button" class="secondary-btn" data-action="edit" data-id="${product.id}" data-category="${activeCategory}">Editar</button>` : ''}
          </div>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  if (adminPrompt) {
    adminPrompt.textContent = 'Faça login como administrador para cadastrar ou editar produtos.';
  }
}

function startEditProduct(productId, category) {
  const product = getProducts(category).find((item) => item.id === productId);
  if (!product) return;

  editProductId = productId;
  editCategory = category;
  productCategoryInput.value = category;
  productNameInput.value = product.name;
  productPriceInput.value = product.price;
  productImageInput.value = product.image;
  productDescriptionInput.value = product.description;
  productLinkInput.value = product.link || '';
  saveButton.textContent = 'Salvar alterações';
  cancelEditButton.classList.remove('hidden');
  if (deleteButton) deleteButton.classList.remove('hidden');
}

function clearForm() {
  editProductId = null;
  editCategory = null;
  adminForm.reset();
  saveButton.textContent = 'Adicionar produto';
  cancelEditButton.classList.add('hidden');
  if (deleteButton) deleteButton.classList.add('hidden');
  productCategoryInput.value = activeCategory;
}

function deleteProduct() {
  if (!adminMode || !editProductId) {
    alert('Selecione um produto para excluir.');
    return;
  }

  const category = editCategory || productCategoryInput.value;
  const products = getProducts(category);
  const productIndex = products.findIndex((item) => item.id === editProductId);

  if (productIndex === -1) {
    alert('Produto não encontrado.');
    clearForm();
    return;
  }

  if (!confirm('Tem certeza de que deseja excluir este produto?')) {
    return;
  }

  products.splice(productIndex, 1);
  saveState();
  clearForm();
  setActiveCategory(category);
}

function saveProduct(event) {
  event.preventDefault();

  if (!adminMode) {
    alert('Somente administradores podem salvar produtos. Faça login como admin.');
    return;
  }

  const category = productCategoryInput.value;
  const name = productNameInput.value.trim();
  const price = Number(productPriceInput.value);
  const image = productImageInput.value.trim();
  const description = productDescriptionInput.value.trim();
  const link = productLinkInput.value.trim();

  if (!name || !price || !image || !description) {
    alert('Preencha nome, preço, imagem e descrição.');
    return;
  }

  const targetProducts = getProducts(category);
  if (!editProductId && targetProducts.length >= MAX_PRODUCTS) {
    alert('Esta categoria já atingiu o limite de 100 produtos.');
    return;
  }

  if (editProductId) {
    const oldCategory = editCategory || category;
    const oldProducts = getProducts(oldCategory);
    const productIndex = oldProducts.findIndex((item) => item.id === editProductId);
    if (productIndex === -1) {
      clearForm();
      return;
    }

    const updatedProduct = {
      ...oldProducts[productIndex],
      name,
      price,
      image,
      description,
      link,
      store: category === 'mercado' ? 'Mercado Pago' : 'Shopee'
    };

    if (oldCategory === category) {
      oldProducts[productIndex] = updatedProduct;
    } else {
      oldProducts.splice(productIndex, 1);
      categories[category].products.unshift(updatedProduct);
    }
  } else {
    const newProduct = {
      id: crypto.randomUUID(),
      name,
      price,
      image,
      description,
      store: category === 'mercado' ? 'Mercado Pago' : 'Shopee',
      link
    };
    categories[category].products.unshift(newProduct);
  }

  saveState();
  setActiveCategory(category);
  clearForm();
}

function handleProductAction(event) {
  const button = event.target.closest('button');
  if (!button) return;
  const action = button.dataset.action;
  const productId = button.dataset.id;
  const category = button.dataset.category;

  if (action === 'edit' && productId && category) {
    startEditProduct(productId, category);
  }
}

function renderStores() {
  const storesGrid = document.getElementById('storesGrid');
  if (!storesGrid) return;
  storesGrid.innerHTML = '';

  defaultStores.forEach((store) => {
    const card = document.createElement('article');
    card.className = 'store-card';
    card.innerHTML = `
      <div class="store-logo">
        <img src="${store.logo}" alt="${store.name}" />
      </div>
      <div class="store-info">
        <h4>${store.name}</h4>
        <p>${store.description}</p>
        <span class="store-category">${store.category}</span>
      </div>
      <button class="btn store-visit" type="button" onclick="window.open('${store.link}', '_blank')">
        Visitar Loja
      </button>
    `;
    storesGrid.appendChild(card);
  });
}

function init() {
  loadTheme();
  loadState();
  loadAdminState();
  renderProducts();
  renderStores();
  updateCategoryCount();

  categoryTabs.forEach((button) => {
    button.addEventListener('click', () => {
      setActiveCategory(button.dataset.category);
    });
  });

  adminForm.addEventListener('submit', saveProduct);
  cancelEditButton.addEventListener('click', clearForm);

  if (adminLoginButton) {
    adminLoginButton.addEventListener('click', requestAdminLogin);
  }

  if (logoutAdminButton) {
    logoutAdminButton.addEventListener('click', () => {
      adminMode = false;
      localStorage.removeItem('shophub_admin');
      updateAdminAccess();
      renderProducts();
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener('click', deleteProduct);
  }

  document.addEventListener('click', handleProductAction);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      isDarkMode = !isDarkMode;
      applyTheme();
    });
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) {
        navLinks.classList.toggle('open');
      }
    });
  }
}

init();
