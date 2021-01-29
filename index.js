const ShiroIs = require('./sources/shirois.js').simple;
const ShiroIsCb = require('./sources/shirois.js');
const TwistMoe = require('./sources/twist.js');
const FourAnime = require('./sources/fouranime.js');

module.exports.shiro.simple = new ShiroIs();
module.exports.shiro = new ShiroIsCb();
module.exports.twist = new TwistMoe();
module.exports.fouranime = new FourAnime();