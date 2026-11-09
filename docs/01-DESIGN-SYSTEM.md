# FIXIN — Design System

## 1. Arah Visual
Pertahankan identitas visual project sekarang: clean, modern, profesional, cocok untuk jasa servis elektronik.

Karakter:
- modern
- terpercaya
- sederhana
- tidak terlalu ramai
- fokus pada CTA dan status servis

## 2. Warna
Gunakan warna yang sudah ada di project sebagai sumber utama.

### Primary
- Navy gelap: untuk navbar, heading penting, sidebar admin.
- Teal: untuk CTA utama, tombol booking, status sukses.

### Neutral
- Putih: background card.
- Abu terang: background section dan tabel.
- Abu gelap: body text.

### Semantic
- Success: hijau/teal
- Warning: kuning/oranye
- Danger: merah
- Info: biru

Jangan memperkenalkan terlalu banyak warna baru.

## 3. Typography
Font existing:
- Heading: `Poppins`
- Body/UI: `Inter`

Hierarchy:
- H1: 40–52 px desktop
- H2: 30–38 px
- H3: 20–24 px
- Body: 14–16 px
- Caption: 12–14 px

## 4. Spacing
Gunakan skala konsisten:
- 4px
- 8px
- 12px
- 16px
- 24px
- 32px
- 48px
- 64px

## 5. Radius
- Button: 8–12px
- Input: 8–10px
- Card: 12–16px
- Modal: 16px

## 6. Komponen Wajib

### Public
- Navbar
- Hero
- Service/Product Card
- Badge harga
- Button primary/secondary
- Footer

### Authentication
- Login card
- Email input
- Password input
- Show/hide password
- Error message

### User Dashboard
- Summary card
- Order history table/card
- Status badge
- Invoice button
- Print receipt button
- Track service button

### Booking & Checkout
- Service selector
- Delivery method selector:
  - Antar sendiri
  - Dijemput kurir
- Address field tampil hanya saat dijemput
- Summary biaya
- Payment method section
- Pay button

### Admin
- Sidebar
- Topbar
- Statistic cards
- CRUD table
- Modal/form create-edit product
- Delete confirmation
- Transaction table
- Filter report
- Export Excel button

## 7. Status Badge
Standarkan status servis:
- `Menunggu Konfirmasi`
- `Diterima`
- `Dijemput`
- `Dalam Pemeriksaan`
- `Dalam Perbaikan`
- `Selesai`
- `Diantar Kembali`
- `Diterima Pelanggan`
- `Dibatalkan`

Status pembayaran:
- `Belum Dibayar`
- `Pending`
- `Lunas`
- `Gagal`

## 8. Responsive Rules
### Desktop >= 1024px
- Sidebar admin tetap.
- Tabel penuh.
- Grid katalog 3 kolom.

### Tablet 768–1023px
- Grid 2 kolom.
- Sidebar admin dapat collapse.

### Mobile < 768px
- Grid 1 kolom.
- Tabel menggunakan horizontal scroll atau card mode.
- Tombol CTA full-width bila perlu.
- Form row menjadi single column.

## 9. UX Rules
- Selalu tampilkan feedback setelah create/update/delete.
- Jangan gunakan `alert()` untuk UI utama bila bisa memakai toast/modal.
- Konfirmasi sebelum delete.
- Disable tombol submit saat proses.
- Form wajib memiliki label, bukan placeholder saja.
- Gunakan format Rupiah: `Rp 150.000`.
- Gunakan tanggal format Indonesia untuk UI.
