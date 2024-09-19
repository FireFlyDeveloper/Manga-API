class Controller {

    constructor(service) {
        this.service = service;
    }

    async getLatestRelease(req, res) {
        try {
            const result = await this.service.latestRelease();
            res.json(result);
        } catch (error) {
            res.status(500).set('Content-Type', 'text/plain').send(`There is an error getting Latest Release!\n\nError report:\n${error}`);
        }
    }

    async getLatestManga(req, res) {
        let page = req.query.page;
        page = parseInt(page) || 1;
        if (page < 1) page = 1;
        try {
            const result = await this.service.latestManga(page);
            res.json(result);
        } catch (error) {
            res.status(500).set('Content-Type', 'text/plain').send(`There is an error getting Latest Manga!\n\nError report:\n${error}`);
        }
    }

    async getSearch(req, res) {
        const query = req.query.query;
        if (!query) {
            return res.status(400).send("query is required");
        }
        let page = req.query.page;
        page = parseInt(page) || 1;
        if (page < 1) page = 1;
        try {
            const result = await this.service.search(query, page)
            res.json(result);
        } catch (error) {
            res.status(500).set('Content-Type', 'text/plain').send(`There is an error Searching Manga!\n\nError report:\n${error}`);
        }
    }

    async getChapterInfo(req, res) {
        const id = req.query.id;
        if (!id) {
            return res.status(400).send("id is required");
        }
        try {
            const result = await this.service.chapterInfo(id);
            res.json(result);
        } catch (error) {
            res.status(500).set('Content-Type', 'text/plain').send(`There is an error getting Chapter Info Manga!\n\nError report:\n${error}`);
        }
    }

    async getFetchChapter(req, res) {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send("id is required");
        }
        const chapterID = req.params.chapterID;
        if (!chapterID) {
            return res.status(400).send("chapterID is required");
        }
        try {
            const result = await this.service.fetchChapter(id, chapterID);
            res.json(result);
        } catch (error) {
            res.status(500).set('Content-Type', 'text/plain').send(`There is an error Fetching Chapter Manga!\n\nError report:\n${error}`);
        }
    }
}

const service = require("./mangakakalot");
module.exports = new Controller(service);