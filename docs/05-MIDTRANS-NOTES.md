# FIXIN — Midtrans Integration Notes

## Prinsip Keamanan
Midtrans memiliki dua jenis key penting:
- **Client Key**: boleh digunakan pada sisi frontend untuk kebutuhan client-side yang didukung.
- **Server Key**: bersifat rahasia dan digunakan untuk operasi server-side.

Server Key tidak boleh ditulis di:
- HTML
- file JavaScript browser
- localStorage
- repository publik

## Flow Midtrans Snap yang Benar

```text
Frontend Checkout
      |
      | request Snap Token
      v
Backend / Serverless Function
      |
      | Server Key -> Midtrans Snap API
      v
Midtrans
      |
      | Snap Token
      v
Backend
      |
      | token
      v
Frontend
      |
      | snap.pay(token)
      v
Midtrans Payment UI
```

## Implementasi untuk Tugas Frontend-Only

### Mode A — Pure Frontend Demo
Gunakan jika dosen benar-benar melarang backend.

- Tampilkan UI checkout.
- Load struktur Midtrans Snap bila perlu.
- Gunakan payment simulation untuk status Lunas/Pending/Gagal.
- Jelaskan pada laporan bahwa token production tidak dapat dibuat dengan aman pada frontend-only.

### Mode B — Frontend + Serverless Minimal
Gunakan hanya jika dosen mengizinkan endpoint kecil untuk payment.

Endpoint contoh:
```text
POST /api/midtrans-token
```

Frontend mengirim:
```json
{
  "orderId": "ORD-...",
  "grossAmount": 270000,
  "customer": {}
}
```

Endpoint menyimpan Server Key sebagai environment variable, menghubungi Midtrans Sandbox, dan mengembalikan Snap Token.

## Environment
Untuk presentasi/tugas gunakan Sandbox, bukan production.

Snap Sandbox script:
```html
<script
  src="https://app.sandbox.midtrans.com/snap/snap.js"
  data-client-key="YOUR_SANDBOX_CLIENT_KEY">
</script>
```

Frontend kemudian memanggil:
```js
snap.pay(snapToken, {
  onSuccess: function(result) {},
  onPending: function(result) {},
  onError: function(result) {},
  onClose: function() {}
});
```

## Catatan Penilaian
Saat presentasi, jelaskan:
> "Website utama dibuat frontend-only sesuai ketentuan. Untuk menjaga Server Key tetap rahasia, integrasi Midtrans produksi memerlukan backend/serverless untuk pembuatan Snap Token. Pada versi demo frontend, alur pembayaran disimulasikan atau menggunakan endpoint sandbox terpisah bila diizinkan."
