const ShiroIs = require('./sources/shirois');
const ShiroIsCb = require('./sources/shirois').cb;

module.exports.shiro = new ShiroIs();
module.exports.shiro.cb = new ShiroIsCb();