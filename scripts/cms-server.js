const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../'))); // serve app statically

const CONTENT_FILE = path.join(__dirname, '../content/compiled/content.json');

app.get('/api/content', (req, res) => {
    fs.readFile(CONTENT_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(JSON.parse(data));
    });
});

app.post('/api/content', (req, res) => {
    fs.writeFile(CONTENT_FILE, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// A simple CMS HTML served at /cms
app.get('/cms', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>RAGANTARA CMS Ringan</title>
            <link rel="stylesheet" href="/src/styles/tokens.css">
            <style>
                body { padding: 2rem; background: var(--bg0); color: var(--ink); }
                textarea { width: 100%; height: 400px; background: var(--bg1); color: var(--ink); border: 1px solid var(--line); padding: 1rem; font-family: monospace; }
                button { background: var(--gold); color: #000; padding: 10px 20px; font-weight: bold; cursor: pointer; border: none; border-radius: 8px; }
            </style>
        </head>
        <body>
            <h1>CMS Ringan (Edit JSON Langsung)</h1>
            <p>Peringatan: Mengedit konten di sini akan menimpa file content.json.</p>
            <button onclick="saveContent()">Simpan Perubahan</button>
            <br><br>
            <textarea id="json-editor"></textarea>

            <script>
                fetch('/api/content').then(r => r.json()).then(data => {
                    document.getElementById('json-editor').value = JSON.stringify(data, null, 2);
                });

                function saveContent() {
                    const val = document.getElementById('json-editor').value;
                    try {
                        const parsed = JSON.parse(val);
                        fetch('/api/content', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(parsed)
                        }).then(() => alert('Berhasil disimpan! Muat ulang aplikasi utama.'));
                    } catch (e) {
                        alert('JSON tidak valid: ' + e.message);
                    }
                }
            </script>
        </body>
        </html>
    `);
});

const PORT = 3001;
const server = app.listen(PORT, () => {
    console.log(`CMS Server running on http://localhost:${PORT}/cms`);
});
server.on('error', e => console.error(e));

setInterval(() => {}, 1000 * 60 * 60); // Keep alive just in case
