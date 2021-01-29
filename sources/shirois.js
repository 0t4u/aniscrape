const qs = require('qs');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');

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
}

class ShiroIsCB {
    constructor() {
        this.fetch = fetch;
        this.qs = qs;
        this.puppeteer = puppeteer;
    }
    /**
     * Search anime
     * @param {string} animeToSearchFor anime name to search for
     * @param {function} cb callback
     */
    async search(animeToSearchFor, cb) {
        let html = await(await fetch('https://shiro.is')).text();
        let script = 'https://shiro.is' + html.match(/src\=\"(\/static\/js\/main\..*?)\"/)[1];
        script = await(await fetch(script)).text();
        const token = script.match(/token\:\"(.*?)\"/)[1];
        const params = qs.stringify({
            'search': animeToSearchFor,
            'token': token
        });
        const link = `https://ani.api-web.site/advanced?${params}`;
        let searchResults = JSON.parse(await (await fetch(link)).text()).data.nav;
        if (typeof searchResults != "undefined") {
            cb (searchResults.currentPage.items);
        } else {
            return null;
        }
    }
    /**
     * Get random anime
     * @param {function} cb callback
     */
    async random(cb) {
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
            cb (res);
        } else {
            return null;
        }
    }
    /**
     * Get latest updated
     * @param {'anime'|'episode'|'ongoing'} type anime or episode or ongoing
     * @param {function} cb callback
     */
    async latest(type, cb) {
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
                    cb (res);
                } else {
                    return null;
                }
                break;
            case 'episode':
                res = JSON.parse(await (await fetch(link)).text()).data.latest_episodes;
                if (typeof res != "undefined") {
                    cb (res);
                } else {
                    return null;
                }
                break;
            case 'ongoing':
                res = JSON.parse(await (await fetch(link)).text()).data.ongoing_animes;
                if (typeof res != "undefined") {
                    cb (res);
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
     * @param {function} cb callback
     */
    async trending(cb) {
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
            cb (res);
        } else {
            return null;
        }
    }
    /**
     * Get link to anime page
     * @param {string} anime anime name
     * @param {string} ep anime episode
     * @param {function} cb callback
     */
    async getlink(anime, ep, cb) {
        this.search(anime, (ani) => {
            const slug = ani[0].slug;
            const link = `https://shiro.is/stream/${slug}-episode-${ep}`
            return cb(link)
        })
    }
    /**
     * Get video source link
     * @param {string} anime anime name
     * @param {string} ep anime episode
     * @param {function} cb callback
     */
    async getiframe(anime, ep, cb) {
        this.getlink(anime, ep, async (ani) => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setJavaScriptEnabled(true);
            await page.goto(ani, {
                waitUntil: ['domcontentloaded', 'networkidle2']
            });
            page.waitForTimeout(10000)
            const iframe = await page.evaluate(() => {
                return {
                    link: document.getElementById('video').lastChild.src
                }
            })
            cb(iframe.link)
            await browser.close();
        })
    }
    /**
     * Get video source from iframe
     * @param {string} anime anime name
     * @param {string} ep anime episode
     * @param {function} cb callback
     */
    async getvideo(anime, ep, cb) {
        this.getiframe(anime, ep, async (ani) => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(ani);
            const video = await page.evaluate(() => {
                return {
                    src: window.data.source[0].file
                }
            })
            cb(video.src)
            await browser.close();
        })
    }
}

module.exports = ShiroIs;
module.exports.cb = ShiroIsCB