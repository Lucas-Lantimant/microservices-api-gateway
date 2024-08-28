const { validateToken } = require('../middlewares/validationMiddleware');
const movieTheaterController = require('../controllers/movieTheaterController');
const citiesController = require('../controllers/citiesController');

module.exports = (app, repository) => {
    const movieThCtrl = movieTheaterController(repository);
    const citiesCtrl = citiesController(repository);

    app.get('/cinemas/:cinemaId/movies/:movieId', validateToken, movieThCtrl.getMovieSessionsByCinema);
    app.get('/cities/:cityId/movies/:movieId', validateToken, movieThCtrl.getMovieSessionsByCity);
    app.get('/cinemas/:cinemaId/movies', validateToken, movieThCtrl.getMoviesByCinema);
    app.get('/cities/:cityId/movies', validateToken, movieThCtrl.getMoviesByCity);
    app.get('/cities/:cityId/cinemas', validateToken, citiesCtrl.getCinemasByCity);
    app.get('/cities', validateToken, citiesCtrl.getAllCities);
};