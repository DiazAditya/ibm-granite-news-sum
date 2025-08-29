// ======================================================
// File: backend/server.js
// Versi Lengkap dengan Dynamic Scraper & Robust Parsing
// ======================================================

// --- Bagian 1: Inisialisasi & Setup ---
require('dotenv').config({ path: '../.env' });
const express = require('express');
const Replicate = require('replicate');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Inisialisasi Replicate Client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});


// --- Bagian 2: Endpoint Utama untuk Merangkum Berita ---
app.post('/summarize', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  console.log(`\n[INFO] Menerima permintaan untuk URL: ${url}`);

  try {
    console.log('[INFO] Memulai proses web scraping cerdas...');
    const { data } = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });
    const $ = cheerio.load(data);

    // Daftar "kunci universal" (selector umum) yang akan kita coba
    const potentialSelectors = [
        '.detail__body-text p',   // Detik
        '.read__content p',       // Kompas
        '.detail_text p',         // CNN
        'article .post-content p',
        'div[class*="content"] p',
        'div[class*="body"] p',
        'div[class*="main"] p',
        'article p',
        'main p',
        '.post p'
    ];

    let bestText = '';
    let bestSelector = '';

    // Loop melalui setiap selector dan cari yang menghasilkan teks terbanyak
    potentialSelectors.forEach(selector => {
        let currentText = '';
        $(selector).each((i, el) => {
            currentText += $(el).text() + '\n';
        });
        
        if (currentText.length > bestText.length) {
            bestText = currentText;
            bestSelector = selector;
        }
    });

    const articleText = bestText;
    console.log(`[INFO] Scraping selesai. Selector terbaik: "${bestSelector}". Teks diekstrak: ${articleText.length} karakter.`);

    if (articleText.length < 150) {
        return res.status(400).json({ error: 'Tidak dapat mengekstrak konten artikel yang cukup dari URL ini.' });
    }

    // --- Langkah B: Prompt Engineering ---
    const prompt = `
    Anda adalah seorang editor berita AI yang sangat andal. Tugas Anda adalah membaca artikel berita dan membuat rangkuman yang netral dan informatif.

    Berikut adalah teks artikelnya:
    "${articleText}"

    Berdasarkan artikel di atas, berikan jawaban HANYA dalam format JSON dengan struktur sebagai berikut:
    {
      "ringkasan_paragraf": "Buat ringkasan singkat dalam satu paragraf (sekitar 3-4 kalimat) yang mencakup ide utama artikel.",
      "poin_utama": [
        "Ekstrak poin kunci pertama dari artikel.",
        "Ekstrak poin kunci kedua yang penting.",
        "Ekstrak poin kunci ketiga yang relevan."
      ]
    }
    `;

    // --- Langkah C: Panggil Replicate API ---
    console.log('[INFO] Menghubungi Replicate API, mohon tunggu...');
    const modelIdentifier = "ibm-granite/granite-3.3-8b-instruct";
    
    const output = await replicate.run(modelIdentifier, {
        input: {
            prompt: prompt,
            prompt_template: "<|user|>\n{prompt}\n<|assistant|>\n",
            max_new_tokens: 512, // Anda bisa sesuaikan angka ini
            temperature: 0.7,   // Anda bisa sesuaikan angka ini
        }
    });

    // --- Langkah D: Parsing Respons dari AI ---
    const resultString = output.join('');
    console.log("--- OUTPUT MENTAH DARI AI ---");
    console.log(resultString);
    console.log("-----------------------------");

    try {
        // Mencoba mem-parsing JSON secara langsung
        const resultJson = JSON.parse(resultString);
        console.log('[SUCCESS] Parsing JSON langsung berhasil.');
        res.json(resultJson);
    } catch (parseError) {
        console.warn('[WARNING] Parsing JSON langsung gagal, mencoba metode ekstraksi...');
        // Jika parsing langsung gagal, coba ekstrak blok JSON dari dalam teks
        const jsonMatch = resultString.match(/\{[\s\S]*\}/);
        if (jsonMatch && jsonMatch[0]) {
            console.log('[INFO] Menemukan blok JSON, mencoba parsing ulang...');
            const extractedJson = JSON.parse(jsonMatch[0]);
            console.log('[SUCCESS] Parsing ulang (ekstraksi) berhasil.');
            res.json(extractedJson);
        } else {
            // Jika tidak ditemukan blok JSON sama sekali
            throw new Error('Output AI tidak mengandung format JSON yang valid.');
        }
    }

  } catch (error) {
    // Penanganan error utama
    console.error('[FATAL] Terjadi error di proses utama:', error.message);
    res.status(500).json({ error: 'Terjadi kesalahan internal saat memproses permintaan Anda.' });
  }
});


// --- Bagian 3: Menjalankan Server ---
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
