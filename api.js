const express = require('express');
const app = express();
const port = 3000;

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

app.get('/fetch-chapter', async (req, res) => {
    const query = req.query.query;
    
    try {
        const result = await fetchChapter(query);
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
