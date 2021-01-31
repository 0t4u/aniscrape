const qs = require('qs');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const fs = require('fs');

class GogoAnime {
    constructor() {
        this.qs = qs;
        this.fetch = fetch;
        this.puppeteer = puppeteer;
        this.fs = fs;
    }
    // TODO
}

module.exports = GogoAnime;