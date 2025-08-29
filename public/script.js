// File: public/script.js (Versi Tes Hello World)

const summarizeBtn = document.getElementById('summarizeBtn');
const articleUrlInput = document.getElementById('articleUrl');

summarizeBtn.addEventListener('click', async () => {
  console.log("Tombol diklik, mencoba fetch ke /api...");
  alert("Mencoba menghubungi backend...");

  try {
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Kita kirim body kosong saja untuk tes
      body: JSON.stringify({ url: "test" }),
    });

    // Cek apakah response dari server OK (status 200-299)
    if (!response.ok) {
      throw new Error(`Server merespons dengan status: ${response.status}`);
    }

    // Jika berhasil, ambil data JSON dan tampilkan
    const data = await response.json();
    console.log("Data diterima dari backend:", data);
    alert(`BERHASIL! Pesan dari backend: ${data.message}`);

  } catch (error) {
    console.error("Fetch gagal:", error);
    alert(`GAGAL! Terjadi error saat menghubungi backend: ${error.message}`);
  }
});