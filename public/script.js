// File: frontend/script.js
const summarizeBtn = document.getElementById('summarizeBtn');
const articleUrlInput = document.getElementById('articleUrl');
const resultContainer = document.getElementById('resultContainer');
const loader = document.getElementById('loader'); // Diperbarui dari loadingIndicator ke loader
const summaryParagraph = document.getElementById('summaryParagraph');
const summaryPoints = document.getElementById('summaryPoints');

summarizeBtn.addEventListener('click', async () => {
    const url = articleUrlInput.value;
    if (!url || !url.startsWith('http')) {
        alert('Silakan masukkan URL artikel yang valid!');
        return;
    }

    // Tampilkan loader & sembunyikan hasil sebelumnya
    loader.style.display = 'block';
    resultContainer.style.display = 'none';
    summaryPoints.innerHTML = ''; // Kosongkan list sebelumnya

    try {
        const response = await fetch('/api/index', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Gagal merangkum artikel.');
        }

        const data = await response.json();
        
        // Tampilkan hasil
        summaryParagraph.textContent = data.ringkasan_paragraf;
        data.poin_utama.forEach(point => {
            const li = document.createElement('li');
            li.textContent = point;
            summaryPoints.appendChild(li);
        });

        resultContainer.style.display = 'block';

    } catch (error) {
        alert('Terjadi kesalahan: ' + error.message);
    } finally {
        // Sembunyikan loader
        loader.style.display = 'none';
    }
});