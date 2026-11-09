// tracking.js - cari & tampilkan status servis berdasarkan kode
//
// Order lama (dibuat sebelum tahap booking baru) memakai field
// "kode" & "status" (diterima/diproses/selesai). Order baru (dari
// js/booking.js hasil tahap booking antar/jemput) memakai
// "serviceCode" & "serviceStatus" (Menunggu Konfirmasi, Diterima,
// Dijemput, Dalam Pemeriksaan, Dalam Perbaikan, Selesai,
// Diantar Kembali, Diterima Pelanggan, Dibatalkan). Fungsi di bawah
// mendukung kedua skema supaya fitur lacak servis tetap jalan untuk
// order lama maupun baru.

function cariOrder(kode) {
  var orders = JSON.parse(localStorage.getItem("fixin_orders") || "[]");
  var kodeCari = kode.toLowerCase();
  for (var i = 0; i < orders.length; i++) {
    var kodeOrder = orders[i].serviceCode || orders[i].kode || "";
    if (kodeOrder.toLowerCase() === kodeCari) {
      return { data: orders[i], index: i };
    }
  }
  return null;
}

// Petakan status baru (9 status) ke 3 tahap timeline lama (diterima/diproses/selesai).
function petakanServiceStatusKeStep(serviceStatus) {
  var petaSelesai = ["Selesai", "Diantar Kembali", "Diterima Pelanggan"];
  var petaProses = ["Diterima", "Dijemput", "Dalam Pemeriksaan", "Dalam Perbaikan"];

  if (petaSelesai.indexOf(serviceStatus) !== -1) return 2;
  if (petaProses.indexOf(serviceStatus) !== -1) return 1;
  return -1; // "Menunggu Konfirmasi", "Dibatalkan", atau status tak dikenal
}

function tampilkanHasil(order) {
  var result = document.getElementById("trackingResult");
  var notFound = document.getElementById("trackingNotFound");

  if (!order) {
    result.classList.remove("show");
    notFound.style.display = "block";
    return;
  }

  notFound.style.display = "none";

  var isSkemaBaru = !!order.serviceCode;

  document.getElementById("resKode").textContent = order.serviceCode || order.kode;
  document.getElementById("resNama").textContent = order.customerName || order.nama || "-";
  document.getElementById("resLayanan").textContent = order.serviceName || order.layanan || "-";
  document.getElementById("resTanggal").textContent = formatDateIndonesia(order.serviceDate || order.tanggal);

  var resMetode = document.getElementById("resMetode");
  var resStatusLabel = document.getElementById("resStatusLabel");

  if (resMetode) {
    if (isSkemaBaru) {
      resMetode.textContent = order.deliveryMethod === "pickup" ? "Dijemput Kurir" : "Antar Sendiri";
      resMetode.parentElement.classList.remove("hidden");
    } else {
      resMetode.parentElement.classList.add("hidden");
    }
  }

  if (resStatusLabel) {
    resStatusLabel.textContent = isSkemaBaru ? order.serviceStatus : "-";
    resStatusLabel.parentElement.classList.toggle("hidden", !isSkemaBaru);
  }

  var currentIndex = isSkemaBaru ? petakanServiceStatusKeStep(order.serviceStatus) : ["diterima", "diproses", "selesai"].indexOf(order.status);

  var steps = ["diterima", "diproses", "selesai"];
  steps.forEach(function (step, i) {
    var el = document.getElementById("step-" + step);
    if (!el) return;
    if (i <= currentIndex) {
      el.classList.add("done");
    } else {
      el.classList.remove("done");
    }
  });

  // Tombol simulasi status hanya relevan untuk order skema lama.
  // Untuk order baru, perubahan status dilakukan admin (tahap berikutnya).
  var simulateBtn = document.getElementById("simulateStatus");
  if (simulateBtn) {
    simulateBtn.classList.toggle("hidden", isSkemaBaru);
  }

  result.classList.add("show");
}

var trackingKodeAktif = null;

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("trackingForm");
  var input = document.getElementById("trackingInput");

  // Auto isi dari query string ?kode=FX-1234 (dari halaman booking)
  var params = new URLSearchParams(window.location.search);
  var kodeAwal = params.get("kode");
  if (kodeAwal) {
    input.value = kodeAwal;
    trackingKodeAktif = kodeAwal;
    var found = cariOrder(kodeAwal);
    tampilkanHasil(found ? found.data : null);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    trackingKodeAktif = input.value.trim();
    var found = cariOrder(trackingKodeAktif);
    tampilkanHasil(found ? found.data : null);
  });

  // Live update: kalau admin ubah serviceStatus di tab lain (admin-orders.html),
  // hasil tracking yang lagi ditampilkan ikut disegarkan otomatis tanpa
  // perlu klik "Cek Status" ulang.
  window.addEventListener("storage", function (e) {
    if (!trackingKodeAktif) return;
    if (e.key !== "fixin_orders" && e.key !== null) return;

    var found = cariOrder(trackingKodeAktif);
    tampilkanHasil(found ? found.data : null);
  });

  // Tombol simulasi update status (buat keperluan demo/presentasi tugas)
  var simulateBtn = document.getElementById("simulateStatus");
  if (simulateBtn) {
    simulateBtn.addEventListener("click", function () {
      var found = cariOrder(input.value.trim());
      if (!found) return;

      if (found.data.serviceCode) return; // hanya untuk order skema lama

      var steps = ["diterima", "diproses", "selesai"];
      var orders = JSON.parse(localStorage.getItem("fixin_orders") || "[]");
      var currentIndex = steps.indexOf(orders[found.index].status);

      if (currentIndex < steps.length - 1) {
        orders[found.index].status = steps[currentIndex + 1];
        localStorage.setItem("fixin_orders", JSON.stringify(orders));
        tampilkanHasil(orders[found.index]);
      }
    });
  }
});
