# FIXIN — Testing Checklist

## Authentication
- [ ] User demo dapat login.
- [ ] Admin demo dapat login.
- [ ] Password salah ditolak.
- [ ] Session tersimpan.
- [ ] Logout menghapus session.
- [ ] User tidak masuk ke menu admin melalui UI.
- [ ] Admin dashboard memiliki role guard.

## Products / Services
- [ ] Produk seed muncul.
- [ ] Admin dapat create produk.
- [ ] Admin dapat edit produk.
- [ ] Admin dapat delete produk.
- [ ] Produk nonaktif tidak tampil ke user.
- [ ] Harga menggunakan format Rupiah.

## Booking
- [ ] Layanan berasal dari produk aktif.
- [ ] Dropoff dapat dipilih.
- [ ] Pickup dapat dipilih.
- [ ] Alamat wajib saat pickup.
- [ ] Alamat tidak wajib saat dropoff.
- [ ] Biaya pickup masuk total.
- [ ] Order tersimpan ke fixin_orders.
- [ ] Kode servis unik dibuat.

## Payment
- [ ] Checkout membaca order yang benar.
- [ ] Total checkout benar.
- [ ] Midtrans Client Key saja yang boleh tampil di frontend.
- [ ] Tidak ada Server Key di source code frontend.
- [ ] Demo payment Lunas bekerja.
- [ ] Demo payment Pending bekerja.
- [ ] Demo payment Gagal bekerja.

## User
- [ ] User hanya melihat order miliknya.
- [ ] Tracking berdasarkan kode servis bekerja.
- [ ] Status terbaru admin tampil ke user.
- [ ] Invoice PDF dapat dibuat.
- [ ] Isi invoice sesuai order.
- [ ] Cetak struk membuka tampilan print yang rapi.

## Admin
- [ ] Semua order terlihat.
- [ ] Search transaksi bekerja.
- [ ] Filter status bekerja.
- [ ] Update status servis tersimpan.
- [ ] Dashboard summary sesuai data.

## Reports
- [ ] Filter hari benar.
- [ ] Filter minggu benar.
- [ ] Filter bulan benar.
- [ ] Filter tahun benar.
- [ ] Total transaksi benar.
- [ ] Omzet benar.
- [ ] Export XLSX berhasil.
- [ ] Sheet Ringkasan ada.
- [ ] Sheet Transaksi ada.

## UI / Regression
- [ ] Tidak ada error console pada index.
- [ ] Tidak ada error console pada booking.
- [ ] Tidak ada error console pada tracking.
- [ ] Tidak ada error console pada user dashboard.
- [ ] Tidak ada error console pada admin pages.
- [ ] Navbar mobile bekerja.
- [ ] Layout desktop rapi.
- [ ] Layout mobile rapi.
