const aniflix = require('../sources/animeflix.js');

const animeflix = new aniflix();

/*animeflix.search('tonikaku kawaii', ((ani) => {
    console.log(ani)
}))*/

animeflix.download('tonikaku kawaii', '1', './anime.mp4')