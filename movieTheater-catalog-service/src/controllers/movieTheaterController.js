const movieTheaterController = (repository) => ({
    getMovieSessionsByCinema: async (req, res, next) => {
        try {
            const movieSessions = await repository.getMovieSessionByCinemaId(req.params.movieId, req.params.cinemaId);

            if (!movieSessions || !movieSessions.length) {
                return res.sendStatus(404);
            }
            res.json(movieSessions);
        } catch (error) {
            next(error);
        }
    },

    getMovieSessionsByCity: async (req, res, next) => {
        try {
            const movieSessions = await repository.getMovieSessionByCityId(req.params.movieId, req.params.cityId);

            if (!movieSessions || !movieSessions.length) {
                return res.sendStatus(404);
            }
            res.json(movieSessions);
        } catch (error) {
            next(error);
        }
    },

    getMoviesByCinema: async (req, res, next) => {
        try {
            const movies = await repository.getMoviesByCinemaId(req.params.cinemaId);

            if (!movies || !movies.length) {
                return res.sendStatus(404);
            }
            res.json(movies);
        } catch (error) {
            next(error);
        }
    },

    getMoviesByCity: async (req, res, next) => {
        try {
            const movies = await repository.getMoviesByCityId(req.params.cityId);

            if (!movies || !movies.length) {
                return res.sendStatus(404);
            }
            res.json(movies);
        } catch (error) {
            next(error);
        }
    }
});

module.exports = movieTheaterController;