const fa = require('../sources/fouranime');

const fouranime = new fa();

fouranime.search('toubun no hanayome', '1').then((ani) => {
    console.log(ani)
})

//fouranime.download('toubun no hanayome', '1', './anime.mp4')