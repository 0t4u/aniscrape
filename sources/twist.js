const fetch = require('node-fetch');
const crypto = require('crypto-js');
const fs = require('fs');

class TwistMoe {
    constructor() {
        this.fetch = fetch
        this.base = 'https://twist.moe/api'
        this.crypto = crypto;
    }
    /**
     * Search for an anime
     * @param {string} animeToSearchFor anime name
     * @param {string} ep episode
     * @param {function} cb callback
     */
    async search(animeToSearchFor, ep, cb) {
        const link = `${this.base}/anime`;
        const res = JSON.parse(await (await fetch(link, {headers:{'x-access-token': '0df14814b9e590a1f26d3071a4ed7974', 'user-agent': '1.0.16'}})).text());
        const anime = animeToSearchFor.toLowerCase();
        const f = res.find(x => x.slug.slug === anime || x.title.toLowerCase() === anime) || res.find(x => x.slug.slug.includes(anime) || x.title.toLowerCase().includes(anime));
        cb(f)
    }
    /**
     * Get download link
     * @param {string} animeToSearchFor anime name
     * @param {string} ep episode
     * @param {function} cb callback
     */
    async getlink(animeToSearchFor, ep, cb) {
        this.search(animeToSearchFor, ep, (async (ani) => {
            const l2 = `${this.base}/anime/${ani.slug.slug}/sources`;
            const r2 = JSON.parse(await (await fetch(l2, {headers:{'x-access-token': '0df14814b9e590a1f26d3071a4ed7974', 'user-agent': '1.0.16'}})).text());
            const b2 = r2.find(x => x.number === parseInt(ep));
            const e2 = b2.source;
            const c2 = crypto.AES.decrypt(e2, '267041df55ca2b36f2e322d05ee2c9cf').toString(crypto.enc.Utf8);
            const r3 = `https://cdn.twist.moe${c2}`
            cb(r3)
        }))
    }
    /**
     * Download an anime
     * @param {string} animeToSearchFor anime name
     * @param {string} ep episode
     * @param {string} dir directory
     */
    async download(animeToSearchFor, ep, dir) {
        this.getlink(animeToSearchFor, ep, (async (ani) => {
            const file = fs.createWriteStream(dir);
            fetch(ani, { headers: { 'user-agent': '1.0.16', 'referer': this.base } }).then(res => {
                if(!res.ok) throw new Error(`Server responded with ${res.status} (${res.statusText})`)
                res.body.pipe(file)
                console.log(`Writing file (${dir})...`)
            }).catch(ex => {
                throw new Error(ex)
            })
        }))
    }
}

module.exports = TwistMoe