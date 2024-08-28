const movies = require('./api/movies');
const repository = require('./repository/repository');
const server = require('./server/server');

(async () => {
    try{
        await server.start(movies, repository);
    }
    catch(error) {
        console.error(error);
    }
})(); /* IIFE - IMMEDIATELY INVOKED FUNCTION EXPRESSION: 
        colocar a função entre pareteses é auto invocar ela. */