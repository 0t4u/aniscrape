const assert = require('assert');
// const stream = require('stream');
// const { promises: fs } = require('fs');
const fs = require('fs');
const { Crypto } = require('@peculiar/webcrypto');
const crypto = new Crypto();
// const m3u8 = require('m3u8');
const fetch = require('node-fetch');
const rfetch = require('fetch-retry')(fetch);
const m3u8Parser = require('m3u8-parser');
// const { exec } = require('child_process');
// const puppeteer = require('puppeteer');
// const { createFFmpeg } = require('@ffmpeg/ffmpeg');

// const ffmpeg = createFFmpeg({ log: true });

/** oneliner for promisified stream.pipeline */
// const pipeline = (...streams) => new Promise((res, rej) => stream.pipeline(...streams, e => e ? rej(e) : res() ))

class AnimeFlix {
    constructor() { 
        this.fetch = fetch;
        this.fs = fs;
        this.m3u8Parser = m3u8Parser;
    }

    async request(endpoint, q) {
        const params = new URLSearchParams(q)
        const url = `https://animeflix.io/api${endpoint}?${params}`
        const res = await fetch(url)
        assert(res.ok, new Error(`Server responded with ${res.status} (${res.statusText})`))
        return res
    }
    
    /**
     * Search for an anime
     * @param {string} animeToSearchFor anime name
     */ 
    async search(animeToSearchFor) {
        const res = await this.request('/search', {q: animeToSearchFor})
        const data = await res.json()
        return data.data
    }

    /**
     * Get episodes for an anime
     * @param {string} animeToSearchFor anime name
     */
    async geteps(animeToSearchFor) {
        const ani = await this.search(animeToSearchFor)
        assert(Array.isArray(ani) && ani.length !== 0)

        const id = ani[0].id
        const res = await this.request('/episodes', {anime_id: id})
        const data = await res.json()
        return data.data
    }

    /**
     * Get video link for anime
     * @param {string} animeToSearchFor anime name
     * @param {string} ep episode
     */
    async getvideo(animeToSearchFor, ep) {
        ep = ep - 1
        const eps = await this.geteps(animeToSearchFor);
        assert(Array.isArray(eps) && eps.length >= ep);

        const id = eps[ep].id;
        const res = await this.request('/videos', {episode_id: id});
        const data = await res.json();

        const videos = data
            .filter(v => v.type === 'hls')
            .map(v => v.file.startsWith('/') ? `https://animeflix.io${v.file}` : v.file)

        return videos[0]
    }

    async getdl(playlist) {
        const parser = new m3u8Parser.Parser();
        const manifest = await (await fetch(playlist)).text()
        parser.push(manifest);
        parser.end();
        const segments = parser.manifest.segments
        return(segments)
    }

    /**
     * Download an anime (BROKEN DO NOT USE)
     * @param {string} animeToSearchFor anime name
     * @param {string} ep episode
     * @param {string} dir mp4 file directory
     */
    async download(animeToSearchFor, ep, dir) {
        const ani = await this.getvideo(animeToSearchFor, ep)
        const res = await fetch(ani)
        assert(res.ok, new Error(`Server responded with ${res.status} (${res.statusText})`))
        assert(ani.length !== 0, new Error('No results'))

        const parser = new m3u8Parser.Parser();
        const manifest = await (await fetch(ani)).text()
        parser.push(manifest);
        parser.end();
        const qualities = parser.manifest.playlists.map(track => {
            return {
                quality: track.attributes.RESOLUTION.height,
                codecs: track.attributes.CODECS,
                link: track.uri
            }
        })
        const segments = await this.getdl(`https://animeflix.io${qualities[0]['link']}`);

        const tempFile = fs.createWriteStream('./ztmp');
        const keyFile = fs.createWriteStream('./zkey')
        await fetch(segments[0].key.uri).then(res => {
            res.body.pipe(keyFile)
        })

        const rawk = await fs.readFileSync('./zkey')
        
        await segments.forEach(segment => {
            setTimeout(() => {
                rfetch(segment.uri, {retries: 3, retryDelay: 100}).then(async v => {
                    await v.body.pipe(tempFile);
                })
            }, 20);
        })

        this.transcode('./ztmp', rawk)

        // const parser = m3u8.createStream()
        // await pipeline(res.body, parser)
        // res.body.pipe(parser)
        // parser.on('item', async item => {
        //     item.set('uri', `https://animeflix.io${item.get('uri')}`)
        // })
        // parser.once('m3u', async m3u => {
            // await fs.writeFile('tmp.m3u8', m3u.toString());
        //     console.log(m3u.items.StreamItem[0].properties.uri)
            // await exec(`$(node -p 'require("ffmpeg-static")') -i ./tmp.m3u8 -c copy -bsf:a aac_adtstoasc -safe 0 -protocol_whitelist file,http,https,tcp,tls anime.mp4`)
        // })

        // await ffmpeg.load()
        // ffmpeg.FS('writeFile', 'input.m3u8', parser.m3u.toString())
        // await ffmpeg.run('-i', 'input.m3u8', /*'-acodec', 'copy',*/ '-c', 'copy', '-bsf:a', 'aac_adtstoasc'/*, '-vcodec', 'copy'*/, '-safe', '0', '-protocol_whitelist', 'file,http,https,tcp,tls', 'anime.mp4')
        // await fs.writeFile(dir, ffmpeg.FS('readFile', 'anime.mp4'));
    }

    async transcode(file, key) {
        const data = fs.readFileSync(file)
        crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: new ArrayBuffer(12),
                additionalData: ArrayBuffer,
            },
            key,
            data,
        ).then(enc => {
            return enc
        })
    }
}

module.exports = AnimeFlix;