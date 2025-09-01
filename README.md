Dokumentasi Proyek: AI Rangkum Berita

1. Project Overview
Tujuan Proyek
Tujuan utama dari proyek "AI Rangkum Berita" adalah untuk mengembangkan sebuah aplikasi web yang mampu merangkum artikel berita dari berbagai sumber online secara otomatis dan cepat. Aplikasi ini dirancang untuk menjadi alat bantu produktivitas yang memungkinkan pengguna memahami inti dari sebuah berita tanpa harus membaca keseluruhan artikel yang panjang.
Latar Belakang dan Permasalahan
Di era digital saat ini, kita dibanjiri oleh arus informasi yang tak ada habisnya. Setiap hari, ratusan artikel berita dipublikasikan secara online. Meskipun keinginan untuk tetap terinformasi sangat tinggi, banyak individu—mulai dari profesional yang sibuk, mahasiswa, hingga pembaca kasual—tidak memiliki cukup waktu untuk membaca setiap artikel secara mendalam.
Permasalahan spesifik yang ingin dipecahkan adalah: Bagaimana cara agar pengguna dapat secara efisien menyerap informasi kunci dari berbagai artikel berita online tanpa menghabiskan waktu yang berlebihan?
Pendekatan
Untuk mengatasi masalah tersebut, pendekatan yang diambil adalah dengan membangun aplikasi web full-stack yang memanfaatkan kekuatan Kecerdasan Buatan (AI). Alur kerja aplikasi ini dirancang secara sistematis:
Antarmuka Pengguna (Frontend): Menyediakan antarmuka yang bersih dan minimalis di mana pengguna dapat dengan mudah memasukkan URL artikel berita.
Ekstraksi Konten (Backend): Ketika URL dikirim, server backend secara otomatis mengunjungi halaman tersebut dan melakukan proses web scraping untuk mengekstrak teks utama dari artikel, membersihkannya dari elemen-elemen yang tidak relevan seperti iklan, menu, atau komentar.
Proses AI (Backend): Teks bersih tersebut kemudian dikirim ke sebuah model AI Large Language Model (LLM) melalui API dengan instruksi (prompt) yang spesifik untuk merangkum konten.
Penyajian Hasil (Frontend): Hasil rangkuman yang terstruktur (berupa paragraf dan poin-poin utama) diterima kembali oleh backend dan disajikan kepada pengguna melalui antarmuka yang mudah dibaca.

2. Technologies Used
Pemilihan teknologi untuk proyek ini didasarkan pada kebutuhan akan kecepatan, kemudahan pengembangan, skalabilitas, dan ketersediaan sumber daya (terutama untuk skema gratis).
Kategori
Teknologi
Alasan Pemilihan
Frontend
HTML5, CSS3, Vanilla JavaScript
Dipilih karena kesederhanaannya, performa yang cepat, dan tidak memerlukan framework tambahan. Untuk aplikasi dengan satu fungsi utama seperti ini, Vanilla JS sangat ringan dan efisien, memastikan waktu muat yang cepat bagi pengguna.
Backend
Node.js & Express.js
Node.js memungkinkan eksekusi JavaScript di sisi server, menyatukan bahasa pengembangan untuk frontend dan backend. Express.js adalah framework minimalis yang sangat cocok untuk membuat API endpoint tunggal yang dibutuhkan proyek ini dengan cepat dan efisien.
AI & API
IBM Granite 3.3 8B Instruct & Replicate API
IBM Granite adalah model AI canggih yang dipilih karena kemampuannya yang kuat dalam memahami instruksi dan melakukan abstractive summarization berkualitas tinggi. Replicate API digunakan sebagai platform untuk mengakses model ini. Replicate menyederhanakan proses interaksi dengan AI, mengelola infrastruktur yang kompleks di belakang layar, dan menyediakan skema gratis yang memadai untuk pengembangan dan hosting proyek skala kecil.
Web Scraping
Axios & Cheerio
Axios adalah HTTP client modern berbasis Promise yang andal untuk mengambil konten HTML dari URL target. Cheerio adalah library yang efisien untuk mem-parsing HTML di sisi server dan mengekstrak konten menggunakan sintaks yang mirip dengan jQuery, membuatnya sangat mudah digunakan untuk mengambil teks artikel.
Version Control
Git & GitHub
Git digunakan untuk pelacakan perubahan kode secara lokal. GitHub berfungsi sebagai remote repository untuk menyimpan riwayat kode, memfasilitasi manajemen proyek, dan menjadi dasar untuk proses deployment otomatis.
Deployment
Vercel
Dipilih karena integrasinya yang mulus dengan GitHub, menyediakan CI/CD (Continuous Integration/Continuous Deployment) secara otomatis. Vercel secara cerdas mendeteksi proyek Node.js/Express, mengelolanya sebagai serverless function, dan menyajikan file statis secara optimal. Skema gratisnya sangat memadai untuk men-hosting aplikasi full-stack ini.

3. Features
Aplikasi ini memiliki beberapa fitur utama yang dirancang untuk memberikan pengalaman pengguna yang efisien dan fungsional.
Rangkuman Artikel via URL
Ini adalah fitur inti aplikasi. Pengguna cukup menyalin URL dari hampir semua situs berita online dan menempelkannya ke dalam kolom input.
Cara Kerja: Setelah tombol "Rangkum" diklik, frontend mengirimkan URL ke backend. Backend kemudian melakukan proses scraping, memanggil API AI, dan mengembalikan hasil rangkuman.
Ekstraksi Konten Dinamis (Heuristik)
Aplikasi tidak terbatas pada beberapa situs berita tertentu. Sistem scraping di backend dirancang untuk mencoba beberapa CSS selector yang paling umum digunakan oleh situs-situs berita untuk menemukan konten artikel utama.
Cara Kerja: Backend akan mencoba selector seperti .read__content p, .detail__body-text p, article p, dll., lalu memilih hasil ekstraksi teks yang paling panjang dan paling mungkin benar sebagai sumber untuk dirangkum.
Output Rangkuman Terstruktur
Untuk memaksimalkan pemahaman pengguna, hasil rangkuman tidak hanya disajikan dalam satu format, melainkan dua:
Ringkasan Paragraf: Sebuah paragraf tunggal yang padat dan koheren, memberikan gambaran umum dari keseluruhan berita dalam waktu singkat.
Poin-Poin Utama: Sebuah daftar berpoin yang menyoroti 3-5 informasi atau fakta terpenting dari artikel, memungkinkan pengguna untuk memindai detail kunci dengan cepat.
Antarmuka Pengguna yang Responsif
Desain frontend dibangun dengan prinsip mobile-first. Tampilan aplikasi secara otomatis menyesuaikan diri dengan berbagai ukuran layar, memastikan pengalaman pengguna yang optimal baik di perangkat desktop maupun di smartphone.

4. AI Support Explanation
Kecerdasan Buatan (AI) bukan hanya sekadar tambahan, melainkan merupakan fondasi yang memungkinkan aplikasi ini berfungsi.
Peran dan Penggunaan AI
AI dalam proyek ini, yaitu model IBM Granite 3.3 8B Instruct, berperan sebagai mesin pemahaman dan peringkasan konten. Prosesnya adalah abstractive summarization, di mana AI tidak hanya memilih kalimat-kalimat penting (metode ekstraktif), tetapi benar-benar "membaca" dan "memahami" konteks artikel, lalu menuliskannya kembali menjadi ringkasan baru yang lebih singkat dan koheren dengan bahasanya sendiri.
Cara Penggunaan:
Teks artikel bersih yang didapat dari proses scraping disisipkan ke dalam sebuah template prompt.
Prompt ini adalah instruksi yang sangat spesifik yang memerintahkan AI untuk bertindak sebagai editor berita dan mengembalikan hasilnya dalam format JSON yang telah ditentukan.
Backend mengirim prompt ini ke Replicate API.
AI memproses teks dan instruksi, lalu menghasilkan output JSON yang berisi ringkasan_paragraf dan poin_utama.
Dampak Nyata Penggunaan AI
Memungkinkan Fungsi Inti: Tanpa kemampuan pemahaman bahasa alami dari AI, aplikasi ini tidak akan ada. Algoritma peringkasan tradisional tidak akan mampu menghasilkan ringkasan yang berkualitas dan relevan secara kontekstual.
Meningkatkan Kualitas Hasil: Penggunaan model LLM canggih seperti IBM Granite memastikan bahwa ringkasan yang dihasilkan tidak hanya lebih pendek, tetapi juga akurat, mudah dibaca, dan mempertahankan inti dari berita aslinya.
Menyederhanakan Pengembangan Backend: Dengan memerintahkan AI untuk mengembalikan data dalam format JSON yang terstruktur, kita menghilangkan kebutuhan untuk menulis kode yang kompleks di backend untuk mem-parsing dan membersihkan output teks yang tidak terstruktur. AI tidak hanya merangkum, tetapi juga bertindak sebagai data structurer, yang secara signifikan mempercepat dan menyederhanakan proses pengembangan.
