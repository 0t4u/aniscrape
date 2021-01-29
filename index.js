const ShiroIs = require('./sources/shirois').simple;
const ShiroIsCb = require('./sources/shirois');

module.exports.shiro.simple = new ShiroIs();
module.exports.shiro = new ShiroIsCb();