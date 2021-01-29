const qs = require('qs');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const fs = require('fs');

class FourAnime {
    constructor() {
        this.qs = qs;
        this.fetch = fetch;
        this.puppeteer = puppeteer
        this.fs = fs;
        this.headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9;imag/webp,image/apng",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Max OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36 OPR/69.0.3686.36"
        };
    }
    /**
     * Search for an anime
     * @param {string} animeToSearchFor anime name
     * @param {function} cb callback
     */ 
    async search(animeToSearchFor, cb) {
        const reqbody = 'asl_active=1&p_asl_data=qtranslate_lang%3D0%26set_intitle%3DNone%26customset%255B%255D%3Danime';
        const link = `https://4anime.to/?${qs.stringify({s: animeToSearchFor})}`;
        //let res = JSON.parse(await (await fetch(link, { headers: this.headers, method: 'POST', body: reqbody })).text())
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        await page.setExtraHTTPHeaders(this.headers);
        page.on('request', request => {
            return request.continue({ headers: this.headers, method: 'POST', body: reqbody });
        });
        await page.goto(link, {
            waitUntil: ['domcontentloaded', 'networkidle0']
        }); 
        await page.waitForTimeout(5000)
        const search = await page.evaluate(() => {
            return {
                data: [...document.querySelectorAll('#headerDIV_2 > #headerDIV_95')].map((e) => {
                    const link = e.getElementsByTagName('a')[0].href;
                    const title = e.getElementsByTagName('div')[0].textContent;
                    const image = e.getElementsByTagName('img')[0].src;
                    return {
                        title,
                        image,
                        link: link
                    };
                })
            }
        })
        cb(search.data)
        await browser.close();
    }
    /**
     * Get anime episodes
     * @param {string} animeToSearchFor anime name
     * @param {string} cb callback
     */
    async geteps(animeToSearchFor, cb) {
        this.search(animeToSearchFor, (async (ani) => {
            const link = ani[0].link;
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setRequestInterception(true);
            await page.setExtraHTTPHeaders(this.headers);
            page.on('request', request => {
                return request.continue({ headers: this.headers });
            });
            await page.goto(link, {
                waitUntil: ['domcontentloaded', 'networkidle2']
            }); 
            const search = await page.evaluate(() => {
                return {
                    length: [...document.querySelectorAll('ul.episodes.range.active > li')].map((e) => {
                        return e.getElementsByTagName('a')[0].href;
                    })
                }
            })
            cb(search.length)
            await browser.close();
        }))
    }
    /**
     * Get download link
     * @param {string} animeToSearchFor anime name
     * @param {string} ep episode
     * @param {function} cb callback
     */
    async getvideo(animeToSearchFor, ep, cb) {
        this.geteps(animeToSearchFor, (async (ani) => {
            const link = ani[ep];
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setRequestInterception(true);
            await page.setExtraHTTPHeaders(this.headers);
            page.on('request', request => {
                return request.continue({ headers: this.headers });
            });
            await page.goto(link, {
                waitUntil: ['domcontentloaded', 'networkidle2']
            }); 
            await page.waitForTimeout(5000)
            const search = await page.evaluate(() => {
                return document.querySelectorAll('div.mirror-footer.cl')[0].getElementsByTagName('script')[0].innerHTML.match(RegExp(/href=..([^\\\\]+)/))[1]
            })
            cb(search)
            await browser.close();
        }))
    }
    /**
     * Download an anime
     * @param {string} animeToSearchFor anime name
     * @param {string} ep episode
     * @param {string} dir directory
     */
    async download(animeToSearchFor, ep, dir) {
        this.getvideo(animeToSearchFor, ep, ((ani) => {
            const file = fs.createWriteStream(dir);
            fetch(ani).then(res => {
                if(!res.ok) throw new Error(`Server responded with ${res.status} (${res.statusText})`)
                res.body.pipe(file)
                console.log(`Writing file (${dir})...`)
            }).catch(ex => {
                throw new Error(ex)
            })
        }))
    }
}

module.exports = FourAnime;