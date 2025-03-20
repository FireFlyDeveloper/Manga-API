const axios = require('axios');
const cheerio = require('cheerio');
const urldata = require('url');

class Mangakakalot {

    constructor() {
        this.url = "https://www.mangakakalot.gg";
    }

    async latestRelease() {
        const response = await axios.get(this.url);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            const mangaList = [];
            $('#contentstory .itemupdate.first').each((index, element) => {
                const mangaID = $(element).find('a').attr('href').replace('/manga/', '');
                const thumbnail = `${this.url}${$(element).find('a img').attr('data-src')}`;
                const title = $(element).find('ul li:eq(0) h3 a').text().trim();
                const chapters = [];
                $(element).find('ul li').each((ind, ele) => {
                    if (ind === 0) {
                        return;
                    }
                    const chapterID = $(ele).find('span a').attr('href').replace('/chapter/', '');
                    const chapter = $(ele).find('span a').attr('title');
                    const update = $(ele).find('i').text().trim();

                    chapters.push({ chapterID, chapter, update });
                });
                
                const mangaInfo = {
                    'id': mangaID,
                    'img': thumbnail,
                    title,
                    chapters
                };
                mangaList.push(mangaInfo);
            });
            return { 'results': mangaList };
        }
        throw new Error(`${response.status}`);
    }

    async latestManga(page) {
        page = parseInt(page) || 1;
        if (page < 1) page = 1;
        const response = await axios.get(`${this.url}/manga-list/latest-manga?page=${page}`);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            const results = [];
            $('.truyen-list .list-truyen-item-wrap').each((index, element) => {
                const mangaID = $(element).find('a:eq(0)').attr('href').replace('/manga/', '');
                const img = `${this.url}${$(element).find('a:eq(0) img').attr('data-src')}`;
                const title = $(element).find('a:eq(0)').attr('title');
                const latestChapter = $(element).find('a:eq(2)').attr('title') ? $(element).find('a:eq(2)').attr('title') : "N/A";
                const chapterID = $(element).find('a:eq(2)').attr('href') ? $(element).find('a:eq(2)').attr('href').replace('/chapter/', '') : "N/A";
                const view = $(element).find('.aye_icon').text().trim();
                const description = $(element).find('p').text().trim();

                results.push({
                    mangaID,
                    img,
                    title,
                    latestChapter,
                    chapterID,
                    view,
                    description
                })
            });

            const currentPage = $('.panel_page_number .group_page .page_select').text();
            const totalPage = $('.panel_page_number .group_page .page_last').last().attr('href');
            const parsedUrl = urldata.parse(totalPage, true);
            const pageNumber = parsedUrl.query.page;
            results.push({ 'page': currentPage, 'totalPage': pageNumber });
            return { results };
        }
        throw new Error(`${response.status}`);
    }

    async search(query, page) {
        if (!query) throw Error("Missing query!");
        page = parseInt(page) || 1;
        if (page < 1) page = 1;
        const response = await axios.get(`${this.url}/search/story/${query}?page=${page}`);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            const mangaList = [];
            $('.daily-update .panel_story_list .story_item').each((index, element) => {
                const fullUrl = $(element).find('a').first().attr('href');
                const mangaID = fullUrl.split('/manga/')[1]; // This will get everything after /manga/
                const thumbnail = $(element).find('a img').first().attr('src');
                const title = $(element).find('.story_name a').text().trim();
                const author = $(element).find('.story_item_right span:contains("Author")').text().replace('Author(s) : ', '').trim();
                const update = $(element).find('.story_item_right span:contains("Updated")').text().replace('Updated : ', '').trim();
                const view = $(element).find('.story_item_right span:contains("View")').text().replace('View : ', '').trim();

                const mangaInfo = {
                'id': mangaID,
                'img': thumbnail,
                title,
                author,
                update,
                view
                };
                mangaList.push(mangaInfo);
            });
            const currentPage = $('.panel_page_number .group_page .page_select').text();
            const totalPage = $('.panel_page_number .group_page .page_last').last().attr('href');
            const parsedUrl = urldata.parse(totalPage, true);
            const pageNumber = parsedUrl.query.page;
            return { 'results': mangaList, 'pages':  [{ 'page': currentPage, 'totalPage': pageNumber, 'searchKey': query }]};
        }
        throw new Error(`${response.status}`);
    }

    async chapterInfo(id) {
        if (!id) throw Error("Missing id!");
        const response = await axios.get(`${this.url}/manga/${id}`);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            const thumbnail = $('.manga-info-top .manga-info-pic img').attr('src');
            const title = $('.manga-info-top .manga-info-text li:eq(0) h1').text().trim();
            const alternative = $('.manga-info-top .manga-info-text li:eq(0) h2').text().split(';').map(alternative => alternative.trim());
            const authors = $('.manga-info-top .manga-info-text li:contains("Author(s)")').find('a').map((index, element) => $(element).text().trim()).get();
            const status = $('.manga-info-top .manga-info-text li:eq(2)').text().replace('Status : ', '').trim();
            const lastUpdate = $('.manga-info-top .manga-info-text li:eq(3)').text().replace('Last updated : ', '').trim();
            const view =  $('.manga-info-top .manga-info-text li:eq(5)').text().replace('View : ', '').trim();
            const genres = $('.manga-info-top .manga-info-text li:contains("Genres")').find('a').map((index, element) => $(element).text().trim()).get();
            
            // Updated rating parsing using JSON-LD
            let rating = { score: 0, outOf: 5, votes: 0 };
            try {
                const jsonLd = $('script[type="application/ld+json"]').html();
                if (jsonLd) {
                    const ratingData = JSON.parse(jsonLd);
                    rating = {
                        score: parseFloat(ratingData.ratingValue) || 0,
                        outOf: 5, // This appears to be fixed at 5
                        votes: parseInt(ratingData.ratingCount) || 0
                    };
                }
            } catch (e) {
                // Fallback to text parsing if JSON-LD fails
                const rateText = $('#rate_row_cmd').text();
                const matches = rateText.match(/rate\s*:\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+)\s*-\s*(\d+)\s*votes/);
                if (matches) {
                    rating = {
                        score: parseFloat(matches[1]) || 0,
                        outOf: parseInt(matches[2]) || 5,
                        votes: parseInt(matches[3]) || 0
                    };
                }
            }
            
            // Updated summary parsing
            const summary = $('#contentBox').clone()    // Clone the element
                .children('h2')                         // Find the h2 element
                .remove()                               // Remove the h2
                .end()                                  // Go back to the contentBox
                .text()                                 // Get the text
                .trim();                                // Remove whitespace
            
            const chapters = [];
            $('.chapter .manga-info-chapter .chapter-list .row').each((index, element) => {
                const chapterName = $(element).find('a').text().trim();
                const chapterIDUrl =  $(element).find('a').attr('href');
                const chapterID = chapterIDUrl.split('/manga/')[1];
                const views = $(element).find('span:nth-child(2)').text().trim();
                const timeUploaded = $(element).find('span:nth-child(3)').text().trim();
                const chapterInfo = {
                    chapterName,
                    chapterID,
                    views,
                    timeUploaded
                };
                chapters.push(chapterInfo);
            });
            const results = {
                'img': thumbnail,
                title,
                alternative,
                authors,
                status,
                lastUpdate,
                view,
                genres,
                rating,
                summary,
                chapters
            };
            return { results };
        }
        throw new Error(`${response.status}`);
    }

    async fetchChapter(id, chapterID) {
        if (!id || !chapterID) throw Error("Missing Data!");
        // Remove 'chapter-' prefix if it exists in the chapterID
        const cleanChapterID = chapterID.replace('chapter-', '');
        const response = await axios.get(`${this.url}/manga/${id}/chapter-${cleanChapterID}`);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            const title = $('h1, h2').filter((i, el) => $(el).text().includes(id)).first().text().trim();
            const images = []; 
            $('.container-chapter-reader img').each((index, element) => {
                const primarySrc = $(element).attr('src');
                const fallbackSrc = $(element).attr('onerror')?.match(/this\.src='([^']+)'/)?.[1];
                
                // Only add unique image URLs
                if (primarySrc && !images.includes(primarySrc)) {
                    images.push(primarySrc);
                }
                if (fallbackSrc && !images.includes(fallbackSrc)) {
                    images.push(fallbackSrc);
                }
            });

            // Get available chapters from the chapter navigation
            const chapters = [];
            $('select option, .chapter-selection a').each((index, element) => {
                const chapterText = $(element).text().trim();
                if (chapterText.toLowerCase().includes('chapter')) {
                    const chapterNum = chapterText.match(/Chapter\s+(\d+(\.\d+)?)/i)?.[1];
                    if (chapterNum && !chapters.includes(chapterNum)) {
                        chapters.push(chapterNum);
                    }
                }
            });

            const chapter = {
                title,
                images,
                chapters: chapters.sort((a, b) => parseFloat(b) - parseFloat(a)), // Sort chapters in descending order
                currentChapter: cleanChapterID
            }
            return { 'results': chapter };
        }
        throw new Error(`${response.status}`);
    }
}

module.exports = new Mangakakalot();