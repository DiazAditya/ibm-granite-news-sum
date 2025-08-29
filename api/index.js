// File: api/index.js (VERSI FINAL UNTUK VERCEL)

const express = require('express');
const Replicate = require('replicate');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Inisialisasi Replicate Client
// Vercel akan otomatis memasukkan Environment Variable, jadi dotenv tidak diperlukan.
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Endpoint utama
app.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const { data } = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });
    const $ = cheerio.load(data);
    
    const potentialSelectors = [
        '.detail__body-text p', '.read__content p', '.detail_text p', 'article .post-content p',
        'div[class*="content"] p', 'div[class*="body"] p', 'div[class*="main"] p', 'article p', 'main p', '.post p'
    ];
    let bestText = '';
    potentialSelectors.forEach(selector => {
        let currentText = '';
        $(selector).each((i, el) => { currentText += $(el).text() + '\n'; });
        if (currentText.length > bestText.length) bestText = currentText;
    });

    const articleText = bestText;
    if (articleText.length < 150) {
        return res.status(400).json({ error: 'Tidak dapat mengekstrak konten artikel yang cukup dari URL ini.' });
    }

    const prompt = `Anda adalah seorang editor berita AI yang sangat andal. Tugas Anda adalah membaca artikel berita dan membuat rangkuman yang netral dan informatif. Berikut adalah teks artikelnya: "${articleText}" Berdasarkan artikel di atas, berikan jawaban HANYA dalam format JSON dengan struktur sebagai berikut: { "ringkasan_paragraf": "Buat ringkasan singkat dalam satu paragraf (sekitar 3-4 kalimat) yang mencakup ide utama artikel.", "poin_utama": ["Ekstrak poin kunci pertama dari artikel.", "Ekstrak poin kunci kedua yang penting.", "Ekstrak poin kunci ketiga yang relevan."] }`;
    
    const modelIdentifier = "ibm-granite/granite-3.3-8b-instruct";
    
    const output = await replicate.run(modelIdentifier, {
        input: {
            prompt: prompt,
            prompt_template: "<|user|>\n{prompt}\n<|assistant|>\n",
            max_new_tokens: 512,
            temperature: 0.7,
        }
    });

    const resultString = output.join('');
    const jsonMatch = resultString.match(/\{[\s\S]*\}/);
    if (jsonMatch && jsonMatch[0]) {
        res.status(200).json(JSON.parse(jsonMatch[0]));
    } else {
        throw new Error('Output AI tidak mengandung format JSON yang valid.');
    }

  } catch (error) {
    console.error('[Vercel Function Error]', error.message);
    res.status(500).json({ error: 'Terjadi kesalahan internal saat memproses permintaan Anda.' });
  }
});

// Pastikan tidak ada app.listen() di sini.
// Kita ekspor 'app' agar Vercel bisa menjalankannya.
module.exports = app;