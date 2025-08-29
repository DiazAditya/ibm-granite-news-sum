// File: api/index.js (Versi Tes Hello World)

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Langsung merespons di root path dari fungsi ini
app.post('/', (req, res) => {
  console.log("Fungsi backend berhasil dipanggil!"); // Log ini akan muncul di Vercel
  res.status(200).json({ message: "Halo dari backend! Koneksi berhasil." });
});

module.exports = app;