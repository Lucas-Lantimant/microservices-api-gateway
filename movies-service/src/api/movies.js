const { validateMovie, validateToken, validateAmin } = require('../middlewares/validationMiddleware');
const { logUnauthorizedAccess, logForbiddenAccess } = require('../middlewares/logMiddleware');
const { simulateAuthentication } = require('../middlewares/__mocks__/validationMiddleware');
const moviesController = require('../controllers/moviesController');

module.exports = (app, repository, isTesting = false) => {
    const controller = moviesController(repository);

    // Use simulateAuthentication se isTesting for true
    const authMiddleware = isTesting ? simulateAuthentication : validateToken;

    app.get('/movies/premieres', authMiddleware, logUnauthorizedAccess, logForbiddenAccess, controller.getPremieres);
    app.get('/movies/:id', authMiddleware, logUnauthorizedAccess, logForbiddenAccess, controller.getMovieById);
    app.get('/movies', authMiddleware, logUnauthorizedAccess, logForbiddenAccess, controller.getAllMovies);
    app.post('/movies', authMiddleware, validateAmin, validateMovie, logUnauthorizedAccess, logForbiddenAccess, controller.addMovie);
    app.delete('/movies/:id', authMiddleware, validateAmin, logUnauthorizedAccess, logForbiddenAccess, controller.deleteMovie);
};
