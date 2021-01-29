const na = require('../sources/nineanime.js');
const nineanime = new na();

nineanime.geteps('show by rock', ((ani) => {
    console.log(ani)
}))
