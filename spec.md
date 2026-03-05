# Garda Anti Narkoba Indonesia

## Current State
- Website publik dengan hero, tentang, statistik, program, berita, bergabung, kontak, dan footer
- Admin panel di `/admin` untuk mengelola relawan, artikel, program, pesan, dan pengaturan
- Warna dominan merah Indonesia (oklch merah) di primary, hero, statistik, bergabung
- Logo header dan footer menggunakan `/assets/generated/garda-logo-transparent.dim_400x400.png`
- Tombol "Baca Selengkapnya" di kartu berita ada tapi tidak berfungsi (tidak membuka konten penuh)

## Requested Changes (Diff)

### Add
- Modal/dialog "Baca Selengkapnya" untuk menampilkan konten artikel lengkap saat tombol diklik
- State manajemen artikel yang dipilih untuk modal

### Modify
- Warna primary dari merah (oklch hue 25) ke biru (oklch hue 230) di seluruh `index.css`
- Semua utilitas warna `garda-red` menjadi `garda-blue` di index.css dan App.tsx
- Gradien hero, statistik, bergabung dari merah ke biru
- Shadow `red-glow` menjadi `blue-glow` di tailwind.config.js
- Logo di Navbar header: ganti dari `/assets/generated/garda-logo-transparent.dim_400x400.png` ke `/assets/uploads/55406_original_FB_IMG_1553487322630-removebg-preview-1.png`
- Logo di Footer: ganti ke gambar yang sama

### Remove
- Tidak ada yang dihapus

## Implementation Plan
1. Update `index.css`: ganti semua oklch hue 25 (merah) ke hue 230 (biru), ubah CSS utility classes
2. Update `tailwind.config.js`: ganti shadow `red-glow` ke `blue-glow` dengan warna biru
3. Update `App.tsx`:
   - Ganti src logo di Navbar dan Footer ke path gambar upload baru
   - Tambah state `selectedArticle` dan modal artikel lengkap di BeritaSection
   - Aktifkan tombol "Baca Selengkapnya" untuk membuka modal dengan konten penuh
   - Ganti semua referensi `text-garda-red` → `text-garda-blue`, `bg-garda-red` → `bg-garda-blue`
   - Update gradien hero/statistik/bergabung dari warna merah ke biru
