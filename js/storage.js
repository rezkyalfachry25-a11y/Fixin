// storage.js - source of truth untuk localStorage FIXIN.
// Semua key memakai prefix "fixin_". Wajib di-load SEBELUM script lain
// yang butuh data user/produk/order (booking.js, tracking.js, dll),
// dan SETELAH utils.js karena seed produk pakai generateId().

var FIXIN_KEYS = {
  USERS: "fixin_users",
  SESSION: "fixin_session",
  PRODUCTS: "fixin_products",
  ORDERS: "fixin_orders"
};

// ---------- Helper baca/tulis generik ----------

function fixinGetItem(key, fallback) {
  try {
    var raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Gagal membaca localStorage[" + key + "]", e);
    return fallback;
  }
}

function fixinSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error("Gagal menulis localStorage[" + key + "]", e);
    return false;
  }
}

// ---------- Users ----------

function getUsers() {
  return fixinGetItem(FIXIN_KEYS.USERS, []);
}

function setUsers(users) {
  return fixinSetItem(FIXIN_KEYS.USERS, users);
}

// ---------- Session ----------
// Sengaja pakai sessionStorage (bukan localStorage) khusus untuk session.
// localStorage dibagi ke SEMUA tab dalam origin yang sama, jadi kalau
// dulu login sebagai admin di satu tab, tab lain yang lagi login sebagai
// user ikut "berubah" jadi admin begitu halaman itu baca ulang session.
// sessionStorage terisolasi per tab, jadi tiap tab bisa punya sesi login
// sendiri-sendiri (misalnya testing akun user & admin bersamaan).
// Konsekuensinya: sesi login hilang begitu tab ditutup (harus login lagi
// di tab baru) - trade-off yang wajar untuk kebutuhan ini.

function getSession() {
  try {
    var raw = sessionStorage.getItem(FIXIN_KEYS.SESSION);
    return raw === null ? null : JSON.parse(raw);
  } catch (e) {
    console.error("Gagal membaca sessionStorage[" + FIXIN_KEYS.SESSION + "]", e);
    return null;
  }
}

function setSession(session) {
  try {
    sessionStorage.setItem(FIXIN_KEYS.SESSION, JSON.stringify(session));
    return true;
  } catch (e) {
    console.error("Gagal menulis sessionStorage[" + FIXIN_KEYS.SESSION + "]", e);
    return false;
  }
}

function clearSession() {
  sessionStorage.removeItem(FIXIN_KEYS.SESSION);
}

// ---------- Products ----------

function getProducts() {
  return fixinGetItem(FIXIN_KEYS.PRODUCTS, []);
}

function setProducts(products) {
  return fixinSetItem(FIXIN_KEYS.PRODUCTS, products);
}

// ---------- Orders ----------
// Catatan: booking.html & index.html (quick form) sudah lebih dulu menulis
// langsung ke key "fixin_orders" lewat js/booking.js dengan struktur lama
// (nama, layanan, kode, status, dst). getOrders/setOrders di bawah ini
// generik, jadi tetap bisa membaca order lama itu tanpa error. Migrasi ke
// skema order baru (serviceCode, serviceStatus, paymentStatus, dst)
// dikerjakan di tahap booking/checkout, bukan di tahap fondasi ini.

function getOrders() {
  return fixinGetItem(FIXIN_KEYS.ORDERS, []);
}

function setOrders(orders) {
  return fixinSetItem(FIXIN_KEYS.ORDERS, orders);
}

// ---------- Seed data demo ----------

function seedUsers() {
  var users = getUsers();
  if (users.length > 0) return;

  setUsers([
    {
      id: "USR-001",
      name: "User Demo",
      email: "user@fixin.test",
      password: "user123",
      role: "user"
    },
    {
      id: "ADM-001",
      name: "Admin FIXIN",
      email: "admin@fixin.test",
      password: "admin123",
      role: "admin"
    }
  ]);
}

function seedProducts() {
  var products = getProducts();
  if (products.length > 0) return;

  // Diseed dari layanan yang sudah tampil di index.html & services.html
  setProducts([
    {
      id: "PRD-001",
      name: "Ganti Layar HP",
      category: "HP",
      description: "Penggantian layar retak atau bergaris dengan sparepart original/kompatibel.",
      price: 250000,
      estimatedTime: "1-2 hari",
      active: true
    },
    {
      id: "PRD-002",
      name: "Ganti Baterai",
      category: "HP",
      description: "Baterai boros atau cepat habis, kami ganti dengan yang baru dan bergaransi.",
      price: 150000,
      estimatedTime: "1 hari",
      active: true
    },
    {
      id: "PRD-003",
      name: "Install Ulang OS",
      category: "Laptop",
      description: "Instalasi ulang sistem operasi laptop/PC beserta driver dan software dasar.",
      price: 100000,
      estimatedTime: "1 hari",
      active: true
    },
    {
      id: "PRD-004",
      name: "Perbaikan Konektor Charger",
      category: "HP",
      description: "Perangkat susah mengisi daya karena konektor kendor atau rusak, kami perbaiki.",
      price: 80000,
      estimatedTime: "1 hari",
      active: true
    },
    {
      id: "PRD-005",
      name: "Bersihkan Virus & Malware",
      category: "Laptop",
      description: "Pembersihan virus, malware, dan optimasi performa laptop yang mulai lambat.",
      price: 60000,
      estimatedTime: "Beberapa jam",
      active: true
    },
    {
      id: "PRD-006",
      name: "Servis Tablet",
      category: "Tablet",
      description: "Perbaikan layar sentuh, baterai, dan konektivitas pada perangkat tablet.",
      price: 90000,
      estimatedTime: "1-2 hari",
      active: true
    }
  ]);
}

function seedFixinData() {
  seedUsers();
  seedProducts();
  // fixin_orders SENGAJA tidak di-seed, karena order harus lahir dari
  // aksi booking asli (baik data lama maupun baru), bukan data dummy.
}

// Jalan otomatis begitu storage.js di-load di halaman manapun.
document.addEventListener("DOMContentLoaded", seedFixinData);
