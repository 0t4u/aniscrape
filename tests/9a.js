const na = require('../sources/nineanime.js');
const nineanime = new na();

nineanime.geteps('show by rock').then((ani) => {
    console.log(ani)
})
