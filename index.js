const ShiroIs = require('./sources/shirois.js');
const TwistMoe = require('./sources/twist.js');
const FourAnime = require('./sources/fouranime.js');
const NineAnime = require('./sources/nineanime.js');
const AnimeFlix = require('./sources/animeflix.js');

module.exports.shiro = new ShiroIs();
module.exports.twist = new TwistMoe();
module.exports.fouranime = new FourAnime();
module.exports.nineanime = new NineAnime();
module.exports.animeflix = new AnimeFlix();