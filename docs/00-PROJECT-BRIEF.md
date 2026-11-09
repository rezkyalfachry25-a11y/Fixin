# FIXIN — Project Brief Frontend

## 1. Tujuan
Mengembangkan website frontend layanan servis perangkat elektronik bernama **FIXIN** dengan dua actor utama: **User** dan **Admin**.

Project menggunakan HTML, CSS, dan JavaScript vanilla. Penyimpanan data demo menggunakan `localStorage` agar seluruh fitur dapat didemonstrasikan tanpa backend/database.

## 2. Requirement Wajib

### User
- Form login.
- Login sebagai 1 akun user demo.
- Melihat katalog produk/layanan.
- Membuat booking servis.
- Memilih metode layanan: **Antar Sendiri** atau **Dijemput Kurir**.
- Checkout/pembayaran menggunakan alur Midtrans Sandbox/demo.
- Melihat riwayat transaksi/servis.
- Melacak status servis.
- Cetak invoice menjadi PDF.
- Cetak struk transaksi.

### Admin
- Login sebagai 1 akun admin demo.
- Dashboard admin.
- Melihat seluruh transaksi/order.
- CRUD produk/layanan.
- Mengubah status servis/order.
- Filter laporan berdasarkan **hari / minggu / bulan / tahun**.
- Export laporan menjadi file Excel.
- Cetak struk transaksi bila diperlukan.

## 3. Actor

### User
Akses utama:
- Home
- Katalog
- Booking
- Checkout
- Riwayat transaksi
- Tracking servis
- Invoice
- Profil sederhana / logout

### Admin
Akses utama:
- Dashboard
- Data transaksi
- Data produk/layanan
- CRUD produk
- Update status
- Laporan
- Export Excel
- Logout

## 4. Akun Demo

> Kredensial hanya untuk demo frontend, bukan keamanan produksi.

### User
- Email: `user@fixin.test`
- Password: `user123`
- Role: `user`

### Admin
- Email: `admin@fixin.test`
- Password: `admin123`
- Role: `admin`

## 5. Scope Teknis

Frontend:
- HTML5
- CSS3
- Vanilla JavaScript
- localStorage

Library yang diperbolehkan bila dibutuhkan:
- SheetJS / XLSX untuk export Excel
- jsPDF + AutoTable untuk invoice PDF
- Midtrans Snap.js untuk tampilan payment gateway

## 6. Catatan Penting Midtrans
Midtrans Snap membutuhkan Snap Token yang dibuat menggunakan Server Key dari sisi backend. Karena project ini diwajibkan frontend-only, Server Key **tidak boleh** disimpan di browser.

Untuk demonstrasi tugas:
1. UI checkout mengikuti alur Midtrans.
2. Gunakan Snap Sandbox hanya bila Snap Token disediakan oleh endpoint aman dari dosen/serverless/backend minimal.
3. Bila backend benar-benar dilarang, gunakan **payment simulation mode** dan jelaskan di laporan bahwa integrasi produksi membutuhkan backend untuk membuat Snap Token dan menerima notification/webhook.

## 7. Definition of Done
Project dianggap selesai bila:
- Semua halaman dapat dibuka tanpa error JS.
- Login user/admin mengarahkan ke dashboard masing-masing.
- Route admin tidak dapat digunakan user melalui navigasi normal.
- CRUD layanan berfungsi dan tersimpan di localStorage.
- Booking membuat order baru.
- Order memiliki metode antar/jemput.
- Checkout menghasilkan status pembayaran demo.
- Invoice user dapat diekspor PDF.
- Struk dapat dicetak.
- Laporan admin dapat difilter hari/minggu/bulan/tahun dan diekspor Excel.
- Status servis bisa diubah admin dan tampil pada tracking user.
- Layout responsive minimal desktop + mobile.
