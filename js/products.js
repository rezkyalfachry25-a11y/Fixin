// products.js - satu sumber logic untuk fixin_products:
// 1) render katalog publik (index.html, services.html)
// 2) CRUD produk admin (admin-products.html)
// Butuh utils.js + storage.js, dan untuk halaman admin butuh auth.js juga.

// ---------- Ikon (dipakai ulang dari service-card yang sudah ada) ----------

var PRODUCT_ICONS = {
  HP: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  Laptop: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  Tablet: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="4" y1="18" x2="20" y2="18"/></svg>',
  default: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0-1.4 0l-6 6a1 1 0 0 0 0 1.4l3 3a1 1 0 0 0 1.4 0l6-6a1 1 0 0 0 0-1.4z"/><path d="M9 5 6 2M19 15l3 3M12 2v2M2 12h2M20 12h2M12 20v2"/></svg>'
};

var ARROW_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

function getProductIcon(category) {
  return PRODUCT_ICONS[category] || PRODUCT_ICONS.default;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ---------- Data layer (dipakai admin & tahap booking nanti) ----------

function getActiveProducts() {
  return getProducts().filter(function (p) { return p.active; });
}

function getProductById(id) {
  var products = getProducts();
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) return products[i];
  }
  return null;
}

function addProduct(data) {
  var products = getProducts();
  var newProduct = {
    id: generateId("PRD"),
    name: data.name,
    category: data.category,
    description: data.description,
    price: Number(data.price),
    estimatedTime: data.estimatedTime,
    active: data.active !== false
  };
  products.push(newProduct);
  setProducts(products);
  return newProduct;
}

function updateProductById(id, data) {
  var products = getProducts();
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      products[i].name = data.name;
      products[i].category = data.category;
      products[i].description = data.description;
      products[i].price = Number(data.price);
      products[i].estimatedTime = data.estimatedTime;
      products[i].active = data.active;
      setProducts(products);
      return products[i];
    }
  }
  return null;
}

function deleteProductById(id) {
  var products = getProducts().filter(function (p) { return p.id !== id; });
  setProducts(products);
}

function toggleProductActiveById(id) {
  var products = getProducts();
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      products[i].active = !products[i].active;
      setProducts(products);
      return products[i];
    }
  }
  return null;
}

function validateProductForm(data) {
  var errors = [];
  if (!data.name.trim()) errors.push("Nama layanan wajib diisi.");
  if (!data.category.trim()) errors.push("Kategori wajib dipilih.");
  if (!data.description.trim()) errors.push("Deskripsi wajib diisi.");
  if (!data.estimatedTime.trim()) errors.push("Estimasi waktu wajib diisi.");
  if (data.price === "" || isNaN(data.price) || Number(data.price) <= 0) {
    errors.push("Harga harus berupa angka lebih dari 0.");
  }
  return errors;
}

// ---------- Render katalog publik ----------

function renderProductCatalog(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var products = getActiveProducts();

  if (products.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);">Belum ada layanan aktif saat ini. Silakan kembali lagi nanti.</p>';
    return;
  }

  container.innerHTML = products.map(function (p) {
    return (
      '<div class="service-card">' +
        '<div class="diamond">' + getProductIcon(p.category) + '</div>' +
        '<span class="service-card-category">' + escapeHtml(p.category) + '</span>' +
        '<h3>' + escapeHtml(p.name) + '</h3>' +
        '<p>' + escapeHtml(p.description) + '</p>' +
        '<span class="price">Mulai ' + formatRupiah(p.price) + '</span>' +
        '<span class="service-card-eta">Estimasi ' + escapeHtml(p.estimatedTime) + '</span>' +
        '<a href="booking.html?product=' + encodeURIComponent(p.id) + '" class="arrow-btn" aria-label="Booking ' + escapeHtml(p.name) + '">' + ARROW_ICON + '</a>' +
      '</div>'
    );
  }).join("");
}

// ---------- Admin: tabel produk ----------

function renderAdminProductsTable() {
  var tbody = document.getElementById("productsTableBody");
  var emptyState = document.getElementById("productsEmptyState");
  if (!tbody) return;

  var products = getProducts();

  if (products.length === 0) {
    tbody.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }
  if (emptyState) emptyState.style.display = "none";

  tbody.innerHTML = products.map(function (p) {
    var statusBadge = p.active
      ? '<span class="status-badge status-active">Aktif</span>'
      : '<span class="status-badge status-inactive">Nonaktif</span>';

    return (
      '<tr>' +
        '<td>' + escapeHtml(p.name) + '</td>' +
        '<td>' + escapeHtml(p.category) + '</td>' +
        '<td>' + formatRupiah(p.price) + '</td>' +
        '<td>' + escapeHtml(p.estimatedTime) + '</td>' +
        '<td>' + statusBadge + '</td>' +
        '<td class="admin-table-actions">' +
          '<button type="button" class="btn-link" data-action="edit" data-id="' + p.id + '">Edit</button>' +
          '<button type="button" class="btn-link" data-action="toggle" data-id="' + p.id + '">' + (p.active ? "Nonaktifkan" : "Aktifkan") + '</button>' +
          '<button type="button" class="btn-link btn-link-danger" data-action="delete" data-id="' + p.id + '">Hapus</button>' +
        '</td>' +
      '</tr>'
    );
  }).join("");
}

// ---------- Admin: toast feedback ----------

var fixinToastTimer = null;

function showToast(message) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(fixinToastTimer);
  fixinToastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}

// ---------- Admin: modal create/edit ----------

function openProductModal(product) {
  var backdrop = document.getElementById("productModalBackdrop");
  var title = document.getElementById("productModalTitle");
  var form = document.getElementById("productForm");
  var errorBox = document.getElementById("productFormError");

  if (errorBox) {
    errorBox.style.display = "none";
    errorBox.textContent = "";
  }

  if (product) {
    title.textContent = "Edit Produk";
    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productEstimatedTime").value = product.estimatedTime;
    document.getElementById("productDescription").value = product.description;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productActive").checked = product.active;
  } else {
    title.textContent = "Tambah Produk";
    form.reset();
    document.getElementById("productId").value = "";
    document.getElementById("productActive").checked = true;
  }

  backdrop.classList.add("show");
}

function closeProductModal() {
  var backdrop = document.getElementById("productModalBackdrop");
  if (backdrop) backdrop.classList.remove("show");
}

// ---------- Admin: modal konfirmasi hapus ----------

var pendingDeleteProductId = null;

function openDeleteProductModal(product) {
  pendingDeleteProductId = product.id;
  document.getElementById("deleteProductName").textContent = product.name;
  document.getElementById("deleteModalBackdrop").classList.add("show");
}

function closeDeleteProductModal() {
  pendingDeleteProductId = null;
  document.getElementById("deleteModalBackdrop").classList.remove("show");
}

// ---------- Init ----------

document.addEventListener("DOMContentLoaded", function () {
  // Katalog publik: jalan kalau elemen "catalogGrid" ada di halaman ini.
  renderProductCatalog("catalogGrid");

  // Halaman admin produk: jalan kalau wrapper "adminProductsPage" ada.
  var adminPage = document.getElementById("adminProductsPage");
  if (!adminPage) return;

  var session = requireRole("admin");
  if (!session) return; // sudah di-redirect oleh requireRole

  var welcome = document.getElementById("adminWelcome");
  if (welcome) welcome.textContent = session.name;

  renderAdminProductsTable();

  var openCreateBtn = document.getElementById("openCreateModal");
  if (openCreateBtn) {
    openCreateBtn.addEventListener("click", function () {
      openProductModal(null);
    });
  }

  var closeModalBtn = document.getElementById("closeProductModal");
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeProductModal);

  var cancelFormBtn = document.getElementById("cancelProductForm");
  if (cancelFormBtn) cancelFormBtn.addEventListener("click", closeProductModal);

  var tbody = document.getElementById("productsTableBody");
  if (tbody) {
    tbody.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-action]");
      if (!btn) return;

      var id = btn.getAttribute("data-id");
      var product = getProductById(id);
      if (!product) return;

      var action = btn.getAttribute("data-action");
      if (action === "edit") {
        openProductModal(product);
      } else if (action === "delete") {
        openDeleteProductModal(product);
      } else if (action === "toggle") {
        toggleProductActiveById(id);
        renderAdminProductsTable();
        showToast("Status produk diperbarui.");
      }
    });
  }

  var productForm = document.getElementById("productForm");
  if (productForm) {
    productForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var data = {
        name: document.getElementById("productName").value,
        category: document.getElementById("productCategory").value,
        description: document.getElementById("productDescription").value,
        estimatedTime: document.getElementById("productEstimatedTime").value,
        price: document.getElementById("productPrice").value,
        active: document.getElementById("productActive").checked
      };

      var errors = validateProductForm(data);
      var errorBox = document.getElementById("productFormError");

      if (errors.length > 0) {
        if (errorBox) {
          errorBox.textContent = errors.join(" ");
          errorBox.style.display = "block";
        }
        return;
      }

      var id = document.getElementById("productId").value;
      if (id) {
        updateProductById(id, data);
        showToast("Produk berhasil diperbarui.");
      } else {
        addProduct(data);
        showToast("Produk berhasil ditambahkan.");
      }

      closeProductModal();
      renderAdminProductsTable();
    });
  }

  var cancelDeleteBtn = document.getElementById("cancelDelete");
  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener("click", closeDeleteProductModal);

  var confirmDeleteBtn = document.getElementById("confirmDelete");
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", function () {
      if (!pendingDeleteProductId) return;
      deleteProductById(pendingDeleteProductId);
      closeDeleteProductModal();
      renderAdminProductsTable();
      showToast("Produk berhasil dihapus.");
    });
  }
});
