const qs = require('qs');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const fs = require('fs');
const as = require('./9as.json');
const base = as.s;

class NineAnime {
    constructor() {
        this.qs = qs;
        this.fetch = fetch;
        this.puppeteer = puppeteer
        this.fs = fs;
        this.base = as.s;
    }
    async search(animeToSearchFor, cb) {
        const link = `${base}/search?keyword=${animeToSearchFor}`;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(link, {
            waitUntil: ['domcontentloaded', 'networkidle0']
        });
        const search = await page.evaluate(() => {
            return {
                res: [...document.getElementsByClassName('anime-list')[0].children].map((e) => {
                    return {
                        name: e.querySelector('a:last-child').innerText,
                        url: e.querySelector('a:last-child').href,
                        image: e.querySelector('img').src
                    }
                })
            }
        })
        cb(search.res)
        await browser.close();
    }
    async geteps(animeToSearchFor, cb) {
        this.search(animeToSearchFor, (async (ani) => {
            const link = ani[0].url;
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(link, {
                waitUntil: ['domcontentloaded', 'networkidle0']
            });
            //await page.waitForSelector('#server35')
            await page.waitForTimeout(10000);
            const search = await page.evaluate(async () => {
                await document.querySelector('#server35').click();
                return {
                    res: [...document.querySelectorAll('.episodes a')].map((e) => {
                        return {
                            name: e.dataset.base,
                            url: e.href
                        }
                    }),
                    e: document.body
                }
            }).catch(ex => console.log(ex))
            console.log(search.res)
            console.log(search.e)
            cb(search.res)
            await browser.close();
        }))
    }
}

module.exports = NineAnime;