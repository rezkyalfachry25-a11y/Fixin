// admin-orders.js - logic order untuk sisi admin.
// Dipakai bareng oleh admin-dashboard.html (ringkasan + transaksi terbaru)
// dan admin-orders.html (tabel semua order + filter/search + ubah status).
// Butuh utils.js, storage.js, auth.js sudah ter-load lebih dulu.
//
// Skema order mengikuti js/booking.js & js/checkout.js (satu skema, tidak
// ada lagi skema lama): id, serviceCode, userId, customerName,
// customerEmail, phone, productId, serviceName, deviceType, complaint,
// serviceDate, deliveryMethod ("dropoff"/"pickup"), pickupAddress,
// subtotal, deliveryFee, total, serviceStatus, paymentStatus, paymentType,
// createdAt, updatedAt.
//
// Catatan penting: file ini TIDAK PERNAH menyediakan aksi hapus order.
// Histori transaksi (termasuk yang gagal/dibatalkan) sengaja tetap
// disimpan apa adanya di fixin_orders; admin hanya boleh mengubah
// serviceStatus lewat updateServiceStatusById().

var ADMIN_SERVICE_STATUSES = [
  "Menunggu Konfirmasi",
  "Diterima",
  "Dijemput",
  "Dalam Pemeriksaan",
  "Dalam Perbaikan",
  "Selesai",
  "Diantar Kembali",
  "Diterima Pelanggan",
  "Dibatalkan"
];

var ADMIN_PAYMENT_STATUSES = ["Belum Dibayar", "Pending", "Lunas", "Gagal"];

var ADMIN_STATUS_SELESAI = ["Selesai", "Diantar Kembali", "Diterima Pelanggan"];
var ADMIN_STATUS_DIBATALKAN = "Dibatalkan";

var adminOrdersById = {};

function escapeHtmlAdminOrd(value) {
  return String(value === null || value === undefined ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------- Data & agregasi ----------

function kelompokServiceStatusAdmin(order) {
  if (order.serviceStatus === ADMIN_STATUS_DIBATALKAN) return "dibatalkan";
  if (ADMIN_STATUS_SELESAI.indexOf(order.serviceStatus) !== -1) return "selesai";
  return "aktif";
}

function serviceStatusBadgeClassAdmin(order) {
  var kelompok = kelompokServiceStatusAdmin(order);
  if (kelompok === "selesai") return "status-active";
  if (kelompok === "dibatalkan") return "status-inactive";
  return "status-warning";
}

function paymentStatusBadgeClassAdmin(paymentStatus) {
  if (paymentStatus === "Lunas") return "status-active";
  if (paymentStatus === "Pending") return "status-warning";
  if (paymentStatus === "Gagal") return "status-inactive";
  return "status-info"; // "Belum Dibayar" atau tidak diketahui
}

function hitungRingkasanOrder(orders) {
  var total = orders.length;
  var selesai = 0;
  var dibatalkan = 0;
  var pendapatan = 0;

  orders.forEach(function (o) {
    var kelompok = kelompokServiceStatusAdmin(o);
    if (kelompok === "selesai") selesai++;
    else if (kelompok === "dibatalkan") dibatalkan++;

    if (o.paymentStatus === "Lunas") {
      pendapatan += Number(o.total) || 0;
    }
  });

  var aktif = total - selesai - dibatalkan;

  return { total: total, aktif: aktif, selesai: selesai, dibatalkan: dibatalkan, pendapatan: pendapatan };
}

function updateServiceStatusById(orderId, newStatus) {
  var orders = getOrders();
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].id === orderId) {
      orders[i].serviceStatus = newStatus;
      orders[i].updatedAt = new Date().toISOString();
      setOrders(orders);
      return orders[i];
    }
  }
  return null;
}

// ---------- Halaman: admin-dashboard.html (ringkasan) ----------

function renderRingkasanDashboardAdmin() {
  var elTotal = document.getElementById("statTotalOrder");
  if (!elTotal) return; // bukan halaman dashboard, skip

  var orders = getOrders();
  var ringkasan = hitungRingkasanOrder(orders);

  elTotal.textContent = ringkasan.total;
  document.getElementById("statPendapatan").textContent = formatRupiah(ringkasan.pendapatan);
  document.getElementById("statOrderAktif").textContent = ringkasan.aktif;
  document.getElementById("statOrderSelesai").textContent = ringkasan.selesai;
}

function renderTransaksiTerbaru(limit) {
  var tbody = document.getElementById("recentTransactionsBody");
  if (!tbody) return; // bukan halaman dashboard, skip

  var emptyState = document.getElementById("recentTransactionsEmpty");
  var orders = getOrders()
    .slice()
    .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); })
    .slice(0, limit || 5);

  if (orders.length === 0) {
    tbody.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }
  if (emptyState) emptyState.style.display = "none";

  tbody.innerHTML = orders.map(function (o) {
    return (
      "<tr>" +
        "<td>" + escapeHtmlAdminOrd(o.serviceCode) + "</td>" +
        "<td>" + escapeHtmlAdminOrd(o.customerName) + "</td>" +
        "<td>" + escapeHtmlAdminOrd(o.serviceName) + "</td>" +
        "<td>" + formatRupiah(o.total) + "</td>" +
        '<td><span class="status-badge ' + paymentStatusBadgeClassAdmin(o.paymentStatus) + '">' + escapeHtmlAdminOrd(o.paymentStatus) + "</span></td>" +
        "<td>" + formatDateIndonesia(o.createdAt) + "</td>" +
      "</tr>"
    );
  }).join("");
}

// ---------- Halaman: admin-orders.html (tabel semua order) ----------

function ambilOrderTerfilter() {
  var searchInput = document.getElementById("orderSearchInput");
  var filterServiceStatus = document.getElementById("filterServiceStatus");
  var filterPaymentStatus = document.getElementById("filterPaymentStatus");

  var keyword = (searchInput ? searchInput.value : "").trim().toLowerCase();
  var statusServis = filterServiceStatus ? filterServiceStatus.value : "";
  var statusBayar = filterPaymentStatus ? filterPaymentStatus.value : "";

  return getOrders().filter(function (o) {
    if (statusServis && o.serviceStatus !== statusServis) return false;
    if (statusBayar && o.paymentStatus !== statusBayar) return false;

    if (keyword) {
      var cocok =
        String(o.id || "").toLowerCase().indexOf(keyword) !== -1 ||
        String(o.serviceCode || "").toLowerCase().indexOf(keyword) !== -1 ||
        String(o.customerName || "").toLowerCase().indexOf(keyword) !== -1;
      if (!cocok) return false;
    }

    return true;
  });
}

function orderRowTemplateAdmin(o) {
  return (
    "<tr>" +
      "<td>" + escapeHtmlAdminOrd(o.serviceCode) + "</td>" +
      "<td>" + escapeHtmlAdminOrd(o.customerName) + "</td>" +
      "<td>" + escapeHtmlAdminOrd(o.serviceName) + "</td>" +
      "<td>" + (o.deliveryMethod === "pickup" ? "Dijemput Kurir" : "Antar Sendiri") + "</td>" +
      "<td>" + formatDateIndonesia(o.serviceDate) + "</td>" +
      "<td>" + formatRupiah(o.total) + "</td>" +
      '<td><span class="status-badge ' + serviceStatusBadgeClassAdmin(o) + '">' + escapeHtmlAdminOrd(o.serviceStatus) + "</span></td>" +
      '<td><span class="status-badge ' + paymentStatusBadgeClassAdmin(o.paymentStatus) + '">' + escapeHtmlAdminOrd(o.paymentStatus) + "</span></td>" +
      '<td class="admin-table-actions">' +
        '<button type="button" class="btn-link" data-action="detail" data-id="' + o.id + '">Detail</button>' +
      "</td>" +
    "</tr>"
  );
}

function renderTabelOrderAdmin() {
  var tbody = document.getElementById("ordersTableBody");
  if (!tbody) return; // bukan halaman order, skip

  var emptyState = document.getElementById("ordersEmptyState");
  var orders = ambilOrderTerfilter().sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  adminOrdersById = {};
  orders.forEach(function (o) { adminOrdersById[o.id] = o; });

  if (orders.length === 0) {
    tbody.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }
  if (emptyState) emptyState.style.display = "none";

  tbody.innerHTML = orders.map(orderRowTemplateAdmin).join("");
}

// ---------- Modal detail order (admin) ----------

var adminDetailOrderId = null;

function isiOpsiStatusServis(selectEl, selectedValue) {
  selectEl.innerHTML = ADMIN_SERVICE_STATUSES.map(function (s) {
    return '<option value="' + escapeHtmlAdminOrd(s) + '"' + (s === selectedValue ? " selected" : "") + ">" + escapeHtmlAdminOrd(s) + "</option>";
  }).join("");
}

function openAdminOrderDetail(order) {
  adminDetailOrderId = order.id;

  document.getElementById("adminDetailKode").textContent = order.serviceCode || "-";
  document.getElementById("adminDetailCustomer").textContent = order.customerName || "-";
  document.getElementById("adminDetailKontak").textContent =
    (order.phone || "-") + (order.customerEmail ? " · " + order.customerEmail : "");
  document.getElementById("adminDetailLayanan").textContent = order.serviceName || "-";
  document.getElementById("adminDetailPerangkat").textContent = order.deviceType || "-";
  document.getElementById("adminDetailKeluhan").textContent = order.complaint || "-";
  document.getElementById("adminDetailTanggal").textContent = formatDateIndonesia(order.serviceDate);
  document.getElementById("adminDetailMetode").textContent = order.deliveryMethod === "pickup" ? "Dijemput Kurir" : "Antar Sendiri";

  var alamatRow = document.getElementById("adminDetailAlamatRow");
  if (order.deliveryMethod === "pickup") {
    alamatRow.classList.remove("hidden");
    document.getElementById("adminDetailAlamat").textContent = order.pickupAddress || "-";
  } else {
    alamatRow.classList.add("hidden");
  }

  document.getElementById("adminDetailSubtotal").textContent = formatRupiah(order.subtotal);
  document.getElementById("adminDetailOngkir").textContent = formatRupiah(order.deliveryFee);
  document.getElementById("adminDetailTotal").textContent = formatRupiah(order.total);

  var payBadge = document.getElementById("adminDetailStatusBayar");
  payBadge.textContent = order.paymentStatus || "-";
  payBadge.className = "status-badge " + paymentStatusBadgeClassAdmin(order.paymentStatus);

  document.getElementById("adminDetailDibuat").textContent = formatDateIndonesia(order.createdAt);

  isiOpsiStatusServis(document.getElementById("adminDetailStatusSelect"), order.serviceStatus);

  document.getElementById("adminOrderDetailBackdrop").classList.add("show");
}

function closeAdminOrderDetail() {
  adminDetailOrderId = null;
  document.getElementById("adminOrderDetailBackdrop").classList.remove("show");
}

// ---------- Live refresh lintas tab ----------
// Kalau order berubah dari tab lain (booking/checkout customer, atau tab
// admin lain), halaman ini ikut baca ulang fixin_orders otomatis.

function refreshAdminOrdersLive() {
  renderRingkasanDashboardAdmin();
  renderTransaksiTerbaru(5);
  renderTabelOrderAdmin();
}

window.addEventListener("storage", function (e) {
  if (e.key === FIXIN_KEYS.ORDERS || e.key === null) {
    refreshAdminOrdersLive();
  }
});

// ---------- Init ----------

document.addEventListener("DOMContentLoaded", function () {
  var isDashboardPage = !!document.getElementById("adminDashboardPage");
  var isOrdersPage = !!document.getElementById("adminOrdersPage");

  if (!isDashboardPage && !isOrdersPage) return;

  var session = requireRole("admin");
  if (!session) return; // sudah di-redirect sama requireRole

  var welcome = document.getElementById("adminWelcome");
  if (welcome) welcome.textContent = session.name;

  if (isDashboardPage) {
    renderRingkasanDashboardAdmin();
    renderTransaksiTerbaru(5);
  }

  if (isOrdersPage) {
    // Isi opsi filter status servis & pembayaran secara dinamis.
    var filterServiceStatus = document.getElementById("filterServiceStatus");
    if (filterServiceStatus) {
      ADMIN_SERVICE_STATUSES.forEach(function (s) {
        var opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        filterServiceStatus.appendChild(opt);
      });
    }

    var filterPaymentStatus = document.getElementById("filterPaymentStatus");
    if (filterPaymentStatus) {
      ADMIN_PAYMENT_STATUSES.forEach(function (s) {
        var opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        filterPaymentStatus.appendChild(opt);
      });
    }

    renderTabelOrderAdmin();

    var searchInput = document.getElementById("orderSearchInput");
    if (searchInput) searchInput.addEventListener("input", renderTabelOrderAdmin);
    if (filterServiceStatus) filterServiceStatus.addEventListener("change", renderTabelOrderAdmin);
    if (filterPaymentStatus) filterPaymentStatus.addEventListener("change", renderTabelOrderAdmin);

    document.getElementById("ordersTableBody").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) return;

      var order = adminOrdersById[btn.getAttribute("data-id")];
      if (!order) return;

      if (btn.getAttribute("data-action") === "detail") {
        openAdminOrderDetail(order);
      }
    });

    document.getElementById("closeAdminOrderDetail").addEventListener("click", closeAdminOrderDetail);
    document.getElementById("cancelAdminOrderDetail").addEventListener("click", closeAdminOrderDetail);
    document.getElementById("adminOrderDetailBackdrop").addEventListener("click", function (e) {
      if (e.target === this) closeAdminOrderDetail();
    });

    document.getElementById("saveAdminOrderStatus").addEventListener("click", function () {
      if (!adminDetailOrderId) return;

      var newStatus = document.getElementById("adminDetailStatusSelect").value;
      var updated = updateServiceStatusById(adminDetailOrderId, newStatus);
      if (!updated) return;

      closeAdminOrderDetail();
      renderTabelOrderAdmin();
      showAdminOrderToast("Status servis order " + updated.serviceCode + " diperbarui jadi \"" + newStatus + "\".");
    });
  }
});

// ---------- Toast kecil (tanpa bergantung ke products.js) ----------

var adminOrderToastTimer = null;

function showAdminOrderToast(message) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(adminOrderToastTimer);
  adminOrderToastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2800);
}
