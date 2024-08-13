# Iconnet Internship - Backend

Aplikasi Pengajuan Magang/KP dan PKL untuk pemenuhan tugas Kerja Praktik di PLN ICON PLUS SBU RKAL.


## Prasyarat

Pastikan telah menginstal [Node.js](https://nodejs.org/), [npm (Node Package Manager)](https://www.npmjs.com/), dan [MySQL](https://www.mysql.com/).


## Instalasi

1. Clone repositori ini ke komputer: ```git clone https://github.com/Iconnet-Internship-2024/Iconnet-Internship-Backend.git```

2. Masuk ke direktori proyek.

3. Install semua dependensi yang diperlukan dengan menjalankan perintah: ```npm install```


## Penggunaan

1. Buat file pada folder proyek dengan nama ```.env```. Kemudian copy isi file ```.example.env``` dan paste ke dalam file ```.env```. Selanjutnya atur konfigurasi dalam file ```.env``` sesuai credentials masing masing.
2. Jalankan perintah ```npx sequelize db:migrate``` untuk migrasi database.
3. Jalankan perintah ```npx sequelize seed:all``` untuk seeding database.
4. Untuk menjalankan aplikasi, gunakan perintah: ```npm run dev```
5. Lakukan hal-hal lain sesuai kebutuhan.


## Lisensi

Proyek ini dilisensikan di bawah [Lisensi Proyek] - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.
