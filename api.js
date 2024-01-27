const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());

const { latestRelease, search, latestManga, chapterInfo, fetchChapter } = require('./models');

app.get('/latest-release', async (req, res) => {
    try {
        const result = await latestRelease();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/search', async (req, res) => {
    const query = req.query.query;
    const page = req.query.page;
    
    try {
        const result = await search(query, page);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/latest-manga', async (req, res) => {
    const page = req.query.page;

    try {
        const result = await latestManga(page);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/chapter-info', async (req, res) => {
    const query = req.query.query;
    
    try {
        const result = await chapterInfo(query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/fetch-chapter/:mangaid/:chapterid', async (req, res) => {
    const mangaID = req.params.mangaid;
    const chapterID = req.params.chapterid;
    
    try {
        const result = await fetchChapter(mangaID, chapterID);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/documentation.html');
});

// Start the server
app.listen(port, () => {
    console.log(`[Manga API]\n[Server is running on port ${port}]`);
});
