# FIXIN — Data & File Architecture

## 1. Struktur File Target

```text
/
├── index.html
├── about.html
├── login.html
├── services.html
├── booking.html
├── checkout.html
├── tracking.html
├── user-dashboard.html
├── invoice.html
├── admin-dashboard.html
├── admin-products.html
├── admin-orders.html
├── admin-reports.html
├── css/
│   ├── style.css
│   ├── auth.css
│   ├── dashboard.css
│   └── print.css
├── js/
│   ├── main.js
│   ├── auth.js
│   ├── storage.js
│   ├── products.js
│   ├── booking.js
│   ├── checkout.js
│   ├── tracking.js
│   ├── invoice.js
│   ├── admin.js
│   ├── reports.js
│   └── utils.js
├── img/
└── docs/
```

## 2. localStorage Keys
Gunakan prefix `fixin_` agar konsisten.

### `fixin_users`
```json
[
  {
    "id": "USR-001",
    "name": "User Demo",
    "email": "user@fixin.test",
    "password": "user123",
    "role": "user"
  },
  {
    "id": "ADM-001",
    "name": "Admin FIXIN",
    "email": "admin@fixin.test",
    "password": "admin123",
    "role": "admin"
  }
]
```

### `fixin_session`
```json
{
  "userId": "USR-001",
  "name": "User Demo",
  "role": "user",
  "loginAt": "ISO_DATE"
}
```

### `fixin_products`
```json
[
  {
    "id": "PRD-001",
    "name": "Ganti Layar HP",
    "category": "HP",
    "description": "Penggantian layar retak atau rusak.",
    "price": 250000,
    "estimatedTime": "1-2 hari",
    "active": true
  }
]
```

### `fixin_orders`
```json
[
  {
    "id": "ORD-20260916-001",
    "serviceCode": "FX-1234",
    "userId": "USR-001",
    "customerName": "User Demo",
    "phone": "081234567890",
    "productId": "PRD-001",
    "serviceName": "Ganti Layar HP",
    "deviceType": "HP",
    "complaint": "Layar pecah",
    "serviceDate": "2026-09-16",
    "deliveryMethod": "pickup",
    "pickupAddress": "Alamat demo",
    "subtotal": 250000,
    "deliveryFee": 20000,
    "total": 270000,
    "serviceStatus": "Menunggu Konfirmasi",
    "paymentStatus": "Belum Dibayar",
    "paymentType": null,
    "createdAt": "ISO_DATE",
    "updatedAt": "ISO_DATE"
  }
]
```

## 3. Delivery Method
Nilai internal:
- `dropoff` = pelanggan mengantar perangkat sendiri
- `pickup` = perangkat dijemput kurir

Jika `pickup`:
- alamat wajib
- biaya jemput dapat ditambahkan

## 4. Guard Role
Buat helper:
```js
requireAuth()
requireRole('admin')
requireRole('user')
logout()
```

Karena project frontend-only, guard hanya untuk simulasi UI dan bukan security production.

## 5. Source of Truth
- Produk: `fixin_products`
- Order/transaksi: `fixin_orders`
- Login aktif: `fixin_session`

Jangan hardcode produk berulang kali di beberapa file. Render katalog, select booking, dan CRUD admin dari satu sumber `fixin_products`.
