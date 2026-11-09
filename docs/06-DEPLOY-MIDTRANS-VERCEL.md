# FIXIN — Deploy Backend Kecil Midtrans ke Vercel

Panduan ini untuk memunculkan popup Midtrans Snap **asli** (bukan simulasi),
sesuai permintaan dosen. Backend yang dibuat cuma 1 endpoint kecil
(`api/midtrans-token.js`) khusus membuat Snap Token — sisanya tetap
frontend HTML/CSS/JS biasa.

## 1. Siapkan akun

- Daftar/login ke [Midtrans Sandbox](https://dashboard.sandbox.midtrans.com), ambil **Server Key** di Settings → Access Keys (format `SB-Mid-server-...`).
- Daftar/login ke [Vercel](https://vercel.com) (bisa pakai akun GitHub).

## 2. Install Vercel CLI

```bash
npm install -g vercel
```

## 3. Login & hubungkan project

Dari folder project FIXIN:

```bash
vercel login
vercel link
```

Ikuti instruksi di terminal (pilih akun, buat project baru).

## 4. Testing lokal

Salin `.env.example` jadi `.env.local`, isi Server Key sandbox kamu:

```
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxxxxxxxxxx
```

Jalankan:

```bash
vercel dev
```

Buka `http://localhost:3000`, lakukan booking → checkout → klik "Bayar
dengan Midtrans". Kalau Server Key valid, popup Snap Midtrans asli akan
muncul (bukan lagi Demo Payment Mode).

## 5. Set environment variable di Vercel (untuk deploy)

```bash
vercel env add MIDTRANS_SERVER_KEY
```

Pilih environment **Production** (dan Preview kalau perlu), lalu paste
Server Key sandbox kamu saat diminta.

> Server Key HANYA disimpan di sini (Vercel env var), bukan di kode.

## 6. Deploy

```bash
vercel --prod
```

Vercel akan kasih URL publik (misalnya `https://fixin-xxx.vercel.app`).
Buka URL itu untuk demo ke dosen — file HTML statis otomatis ke-serve,
dan `api/midtrans-token.js` otomatis jadi endpoint `/api/midtrans-token`.

## 7. Kalau lupa isi Client Key

Selain Server Key, `checkout.html` juga masih perlu **Client Key**
sandbox (boleh publik) di:

```html
<script
  src="https://app.sandbox.midtrans.com/snap/snap.js"
  data-client-key="GANTI_DENGAN_CLIENT_KEY_SANDBOX_KAMU">
</script>
```

Tanpa Client Key yang benar, `snap.js` tidak akan mau memunculkan popup
walau Snap Token sudah didapat.

## Troubleshooting singkat

- **Masih masuk Demo Payment Mode padahal sudah deploy** → cek Network
  tab browser saat klik "Bayar dengan Midtrans": kalau `/api/midtrans-token`
  balikin error, baca pesan error-nya (biasanya Server Key salah/kosong).
- **Snap Token berhasil tapi popup tidak muncul** → cek `data-client-key`
  di `checkout.html`, pastikan sudah diganti dari placeholder.
- **Error "order_id sudah digunakan"** → jarang terjadi karena kode sudah
  menempel timestamp ke order_id, tapi kalau muncul berarti dua klik
  "Bayar" terjadi di detik yang sama; coba klik ulang.
