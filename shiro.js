const ShiroIs = require('./sources/shirois');
const ShiroIsCb = require('./sources/shirois').cb;

const shiro = new ShiroIsCb();

/*shiro.search('overlord', (ani) => {
    console.log(ani)
});*/

shiro.getlink('overlord', '1', (l) => {
    console.log(l)
})

shiro.getvideo('overlord', '1', (l) => {
    console.log(l)
})