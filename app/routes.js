const express = require("express");
const router = express.Router();
const models = require("./controller");

router.get("/latest-release", models.getLatestRelease.bind(models));
router.get("/latest-manga", models.getLatestManga.bind(models));
router.get("/search", models.getSearch.bind(models));
router.get("/chapter-info", models.getChapterInfo.bind(models));
router.get("/fetch-chapter/:id/:chapterID", models.getFetchChapter.bind(models));

module.exports = router;