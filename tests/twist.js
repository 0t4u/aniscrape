const Twist = require('../sources/twist')

const twist = new Twist();

twist.search('07-Ghost', (ani) => {
    console.log(ani)
})

//twist.download('07-Ghost', '1', './anime.mp4' )