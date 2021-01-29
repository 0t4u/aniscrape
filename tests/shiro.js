const ShiroIs = require('../sources/shirois').simple;
const ShiroIsCb = require('../sources/shirois');

const shiro = new ShiroIsCb();

/*shiro.search('overlord', (ani) => {
    console.log(ani)
});*/

shiro.download('overlord', '1', './anime.mp4')