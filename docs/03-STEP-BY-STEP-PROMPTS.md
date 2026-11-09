# FIXIN — Step-by-Step Prompts untuk Coding AI

> Prinsip utama: jalankan **satu prompt per tahap**. Setelah setiap tahap, buka website dan tes. Jangan meminta AI mengerjakan seluruh fitur sekaligus.

---

## PROMPT 0 — Audit Project Sebelum Mengubah Kode

```text
Saya punya project frontend FIXIN menggunakan HTML, CSS, dan JavaScript vanilla.

Tugasmu sekarang HANYA melakukan audit project. Jangan mengubah file apa pun.

Baca seluruh struktur file dan jelaskan:
1. halaman yang sudah ada,
2. fungsi JavaScript yang sudah berjalan,
3. penggunaan localStorage yang sudah ada,
4. komponen CSS/desain yang bisa dipakai ulang,
5. potensi konflik bila fitur login, admin, CRUD, invoice PDF, laporan Excel, delivery pickup/dropoff, dan Midtrans ditambahkan.

Kemudian buat rencana perubahan file per file.
Jangan coding dulu.
```

### Selesai jika
- Struktur project dipahami.
- Tidak ada file yang diubah.
- Ada daftar file target.

---

## PROMPT 1 — Refactor Fondasi Data & Utility

```text
Gunakan project FIXIN yang ada. Kerjakan HANYA fondasi data JavaScript.

Buat/rapikan:
- js/storage.js
- js/utils.js

Requirement:
1. localStorage memakai prefix fixin_.
2. Seed otomatis 1 user demo dan 1 admin demo bila data belum ada.
3. Seed katalog layanan dari layanan yang sudah ada di halaman sekarang.
4. Buat helper get/set untuk users, products, orders, session.
5. Buat helper formatRupiah(), formatDateIndonesia(), generateId(), generateServiceCode().
6. Jangan ubah desain dan jangan membuat halaman baru dulu.
7. Jangan hapus fitur booking/tracking lama; sesuaikan agar nanti kompatibel.

Setelah selesai, jelaskan file yang diubah dan cara mengetesnya.
```

---

## PROMPT 2 — Login + Role User/Admin

```text
Tambahkan sistem login frontend pada project FIXIN.

Kerjakan hanya fitur authentication.

Buat:
- login.html
- js/auth.js
- css/auth.css bila diperlukan

Akun demo:
User: user@fixin.test / user123
Admin: admin@fixin.test / admin123

Requirement:
1. Form email + password.
2. Tombol show/hide password.
3. Validasi kredensial dari localStorage.
4. Simpan session ke fixin_session.
5. Role user diarahkan ke user-dashboard.html.
6. Role admin diarahkan ke admin-dashboard.html.
7. Sediakan logout().
8. Buat guard requireAuth() dan requireRole(role).
9. Pertahankan style visual FIXIN yang sudah ada.
10. Jangan membuat fitur dashboard lengkap dulu; cukup halaman placeholder yang valid agar redirect dapat dites.

Jangan mengerjakan CRUD, laporan, PDF, Excel, atau Midtrans pada tahap ini.
```

---

## PROMPT 3 — Katalog Dinamis + CRUD Produk Admin

```text
Sekarang kerjakan HANYA katalog layanan dan CRUD produk admin.

Requirement user/public:
1. Katalog layanan di index/services harus dirender dari fixin_products.
2. Tampilkan nama, kategori, deskripsi, harga, estimasi waktu, dan tombol booking.

Requirement admin:
1. Buat admin-products.html.
2. Tabel daftar produk.
3. Create produk.
4. Edit produk.
5. Delete produk dengan konfirmasi.
6. Toggle aktif/nonaktif.
7. Data tersimpan di localStorage fixin_products.
8. Semua form tervalidasi.
9. Produk yang nonaktif tidak tampil di katalog user.
10. Halaman admin wajib memakai requireRole('admin').

Jangan kerjakan laporan atau Midtrans dulu.
```

---

## PROMPT 4 — Booking + Pilihan Antar / Dijemput

```text
Perbarui booking FIXIN tanpa merusak layout utama.

Requirement:
1. Pilihan layanan berasal dari fixin_products aktif.
2. User memilih salah satu:
   - Antar sendiri ke tempat servis (dropoff)
   - Dijemput kurir (pickup)
3. Jika pickup dipilih, tampilkan field alamat lengkap dan biaya pickup.
4. Jika dropoff dipilih, field alamat pickup disembunyikan dan biaya pickup = 0.
5. Tampilkan order summary sebelum submit.
6. Booking menghasilkan order dengan ID, kode servis, status servis, payment status, subtotal, delivery fee, total, createdAt.
7. Simpan ke fixin_orders.
8. Bila user sedang login, userId diambil dari session.
9. Setelah booking arahkan ke checkout.html?order=ORDER_ID.
10. Pertahankan fungsi tracking dengan kode servis.

Jangan buat payment real pada tahap ini.
```

---

## PROMPT 5 — Checkout + Midtrans Sandbox Architecture

```text
Kerjakan halaman checkout untuk project FIXIN.

PENTING:
Project utama frontend-only. Jangan pernah menaruh MIDTRANS SERVER KEY di HTML/JavaScript browser.

Requirement:
1. Buat checkout.html dan js/checkout.js.
2. Ambil order dari query parameter.
3. Tampilkan ringkasan pelanggan, layanan, metode antar/jemput, subtotal, ongkir/pickup fee, dan total.
4. Tambahkan tombol "Bayar dengan Midtrans".
5. Load Midtrans Snap Sandbox menggunakan CLIENT KEY placeholder yang jelas.
6. Struktur kode harus mengharapkan SNAP_TOKEN dari endpoint aman seperti `/api/midtrans-token`.
7. Jika endpoint token tidak tersedia, masuk ke DEMO PAYMENT MODE dengan tombol simulasi:
   - Simulasikan Lunas
   - Simulasikan Pending
   - Simulasikan Gagal
8. Jangan menyimpan Server Key di frontend.
9. Jika sukses/lunas, update paymentStatus order dan arahkan ke invoice.
10. Beri komentar kode yang menjelaskan bagian demo vs produksi.

Tujuan tahap ini adalah agar presentasi frontend tetap bisa jalan tetapi arsitektur Midtrans tidak melanggar keamanan.
```

---

## PROMPT 6 — User Dashboard + Tracking

```text
Kerjakan HANYA dashboard user dan tracking.

Requirement:
1. user-dashboard.html wajib requireRole('user').
2. Tampilkan profil singkat user login.
3. Tampilkan total order, order aktif, order selesai.
4. Tampilkan riwayat order milik user tersebut saja.
5. Setiap order memiliki tombol:
   - Detail
   - Tracking
   - Invoice PDF
   - Cetak Struk
6. Tracking menampilkan timeline status servis.
7. Status harus membaca data terbaru dari fixin_orders sehingga perubahan admin langsung terlihat setelah refresh.
8. Jangan membuat laporan admin pada tahap ini.
```

---

## PROMPT 7 — Invoice PDF + Cetak Struk

```text
Tambahkan output user pada project FIXIN.

Requirement:
1. Invoice hanya untuk order milik user login.
2. Gunakan jsPDF (dan AutoTable bila perlu) untuk menghasilkan PDF.
3. Nama file: FIXIN-Invoice-{ORDER_ID}.pdf
4. Isi invoice:
   - Logo/nama FIXIN
   - nomor invoice/order
   - tanggal
   - data pelanggan
   - layanan
   - metode antar/jemput
   - subtotal
   - biaya pickup bila ada
   - total
   - status pembayaran
5. Tambahkan tombol Cetak Struk.
6. Buat CSS print khusus agar struk rapi ukuran kecil/thermal-friendly.
7. Jangan gunakan screenshot sebagai PDF; PDF harus dibuat dari data transaksi.
```

---

## PROMPT 8 — Admin Dashboard + Order Management

```text
Kerjakan admin dashboard dan manajemen order.

Requirement:
1. admin-dashboard.html dan admin-orders.html wajib requireRole('admin').
2. Dashboard cards:
   - total order
   - pendapatan
   - order aktif
   - order selesai
3. Tampilkan transaksi terbaru.
4. Tabel semua order.
5. Filter order berdasarkan status servis dan payment status.
6. Search berdasarkan order ID, kode servis, nama customer.
7. Admin dapat mengubah serviceStatus.
8. Admin dapat melihat detail antar/jemput dan alamat pickup.
9. Jangan menghapus histori transaksi sembarangan.
10. Semua perubahan disimpan di fixin_orders.
```

---

## PROMPT 9 — Laporan Hari/Minggu/Bulan/Tahun + Excel

```text
Kerjakan HANYA modul laporan admin.

Buat admin-reports.html dan js/reports.js.

Requirement:
1. requireRole('admin').
2. Filter periode:
   - Hari
   - Minggu
   - Bulan
   - Tahun
3. User admin bisa menentukan tanggal referensi/periode.
4. Hitung:
   - jumlah transaksi
   - omzet total
   - transaksi lunas
   - transaksi pending/gagal
   - jumlah layanan terjual
5. Tampilkan tabel detail hasil filter.
6. Gunakan SheetJS/XLSX untuk export Excel.
7. Nama file:
   FIXIN-Laporan-{PERIODE}-{TANGGAL}.xlsx
8. Workbook minimal memiliki sheet:
   - Ringkasan
   - Transaksi
9. Format angka harga sebagai numerik, bukan string "Rp" di data Excel.
10. Data laporan berasal dari fixin_orders, jangan memakai data dummy terpisah.
```

---

## PROMPT 10 — Final Integration & Regression Test

```text
Lakukan final integration pada project FIXIN.

JANGAN menambah fitur baru kecuali untuk memperbaiki bug.

Audit dan tes alur berikut:
1. Login user benar/salah.
2. Login admin benar/salah.
3. Role guard.
4. Logout.
5. Katalog dinamis.
6. CRUD produk admin.
7. Booking dropoff.
8. Booking pickup + alamat.
9. Checkout payment demo / Midtrans architecture.
10. Tracking status.
11. Admin update status.
12. User melihat status terbaru.
13. Invoice PDF.
14. Cetak struk.
15. Report harian.
16. Report mingguan.
17. Report bulanan.
18. Report tahunan.
19. Export Excel.
20. Responsive mobile.

Perbaiki hanya bug yang ditemukan.
Setelah selesai, buat laporan:
- file yang diubah,
- bug yang ditemukan,
- bug yang diperbaiki,
- checklist fitur pass/fail,
- known limitation.
```

---

# Prompt Aturan Umum untuk Ditempel di Awal Setiap Tahap

```text
ATURAN KERJA:
- Jangan rewrite project dari nol.
- Pertahankan desain dan komponen yang sudah bagus.
- Kerjakan hanya scope tahap ini.
- Jangan membuat fitur tahap berikutnya.
- Jangan mengganti nama file existing tanpa alasan kuat.
- Gunakan localStorage sebagai database demo.
- Semua perubahan harus kompatibel dengan halaman lama.
- Setelah coding, cek console browser dan pastikan tidak ada error.
- Selalu jelaskan file yang dibuat/diubah dan cara pengujiannya.
```
