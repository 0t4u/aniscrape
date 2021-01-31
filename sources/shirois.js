const qs = require('qs');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const fs = require('fs');

class ShiroIs {
    constructor() {
        this.fetch = fetch;
        this.qs = qs;
    }
    /**
     * Search anime
     * @param {string} animeToSearchFor anime name to search for
     */
    async search(animeToSearchFor) {
        let html = await(await fetch('https://shiro.is')).text();
        let script = 'https://shiro.is' + html.match(/src\=\"(\/static\/js\/main\..*?)\"/)[1];
        script = await(await fetch(script)).text();
        const token = script.match(/token\:\"(.*?)\"/)[1];
        const params = qs.stringify({
            'search': animeToSearchFor,
            'token': token
        });
        const link = `https://ani.api-web.site/advanced?${params}`
        let searchResults = JSON.parse(await (await fetch(link)).text()).data.nav;
        if (typeof searchResults != "undefined") {
            return searchResults.currentPage.items;
        } else {
            return null;
        }
    }
    /**
     * Get random anime
     */
    async random() {
        let html = await(await fetch('https://shiro.is')).text();
        let script = 'https://shiro.is' + html.match(/src\=\"(\/static\/js\/main\..*?)\"/)[1];
        script = await(await fetch(script)).text();
        const token = script.match(/token\:\"(.*?)\"/)[1];
        const params = qs.stringify({
            'token': token
        });
        const link = `https://ani.api-web.site/anime/random/TV?${params}`;
        let res = JSON.parse(await (await fetch(link)).text()).data;
        if (typeof res != "undefined") {
            return res;
        } else {
            return null;
        }
    }
    /**
     * Get latest updated
     * @param {'anime'|'episode'|'ongoing'} type anime or episode or ongoing
     */
    async latest(type) {
        let html = await(await fetch('https://shiro.is')).text();
        let script = 'https://shiro.is' + html.match(/src\=\"(\/static\/js\/main\..*?)\"/)[1];
        script = await(await fetch(script)).text();
        const token = script.match(/token\:\"(.*?)\"/)[1];
        const params = qs.stringify({
            'token': token
        });
        const link = `https://ani.api-web.site/latest?${params}`;
        switch (type) {
            case 'anime':
                res = JSON.parse(await (await fetch(link)).text()).data.latest_animes;
                if (typeof res != "undefined") {
                    return res;
                } else {
                    return null;
                }
                break;
            case 'episode':
                res = JSON.parse(await (await fetch(link)).text()).data.latest_episodes;
                if (typeof res != "undefined") {
                    return res;
                } else {
                    return null;
                }
                break;
            case 'ongoing':
                res = JSON.parse(await (await fetch(link)).text()).data.ongoing_animes;
                if (typeof res != "undefined") {
                    return res;
                } else {
                    return null;
                }
                break;
            default:
                return null;
        }
    }
    /**
     * Get trending anime
     */
    async trending() {
        let html = await(await fetch('https://shiro.is')).text();
        let script = 'https://shiro.is' + html.match(/src\=\"(\/static\/js\/main\..*?)\"/)[1];
        script = await(await fetch(script)).text();
        const token = script.match(/token\:\"(.*?)\"/)[1];
        const params = qs.stringify({
            'token': token
        });
        const link = `https://ani.api-web.site/latest?${params}`;
        let res = JSON.parse(await (await fetch(link)).text()).data.trending_animes;
        if (typeof res != "undefined") {
            return res;
        } else {
            return null;
        }
    }
    /**
     * Get link to anime page
     * @param {string} anime anime name
     * @param {string} ep anime episode
     */
    async getlink(anime, ep) {
        this.search(anime, (ani) => {
            const slug = ani[0].slug;
            const link = `https://shiro.is/stream/${slug}-episode-${ep}`
            return link
        })
    }
    /**
     * Get video source link
     * @param {string} anime anime name
     * @param {string} ep anime episode
     */
    async getiframe(anime, ep) {
        this.getlink(anime, ep).then((ani) => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setJavaScriptEnabled(true);
            await page.goto(ani, {
                waitUntil: ['domcontentloaded', 'networkidle2']
            });
            await page.waitForTimeout(10000);
            const iframe = await page.evaluate(() => {
                return {
                    link: document.getElementById('video').lastChild.src
                }
            })
            await browser.close();
            return iframe.link
        })
    }
    /**
     * Get video source from iframe
     * @param {string} anime anime name
     * @param {string} ep anime episode
     */
    async getvideo(anime, ep) {
        this.getiframe(anime, ep).then(async (ani) => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(ani);
            const video = await page.evaluate(() => {
                return {
                    src: window.data.source[0].file
                }
            })
            await browser.close();
            return video.src
        })
    }
    /**
     * Download an anime
     * @param {string} animeToSearchFor anime name
     * @param {string} ep episode
     * @param {string} dir directory
     */
    async download(animeToSearchFor, ep, dir) {
        this.getvideo(animeToSearchFor, ep).then((ani) => {
            const file = fs.createWriteStream(dir);
            fetch(ani).then(res => {
                if(!res.ok) throw new Error(`Server responded with ${res.status} (${res.statusText})`)
                res.body.pipe(file)
                console.log(`Writing file (${dir})...`)
            }).catch(ex => {
                throw new Error(ex)
            })
        })
    }
}
module.exports = ShiroIs;