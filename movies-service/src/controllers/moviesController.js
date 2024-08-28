const logger = require('../config/logger');

module.exports = (repository) => {
    const getPremieres = async (req, res, next) => {
        try {
            const movies = await repository.getMoviePremieres();
            if (!movies || !movies.length) {
                return res.sendStatus(404);
            }
            res.json(movies);
        } catch (error) {
            logger.error(`Error fetching premieres: ${error.message}`);
            next(error);
        }
    };

    const getMovieById = async (req, res, next) => {
        try {
            const movie = await repository.getMovieById(req.params.id);
            if (!movie) {
                return res.sendStatus(404);
            }
            res.json(movie);
        } catch (error) {
            logger.error(`Error fetching movie by ID: ${error.message}`);
            next(error);
        }
    };

    const getAllMovies = async (req, res, next) => {
        try {
            const movies = await repository.getAllMovies();
            if (!movies || !movies.length) {
                return res.sendStatus(404);
            }
            res.json(movies);
        } catch (error) {
            logger.error(`Error fetching all movies: ${error.message}`);
            next(error);
        }
    };

    const addMovie = async (req, res, next) => {
        try {
            const { titulo, sinopse, duracao, dataLancamento, imagem, categorias } = req.body;
            const movie = await repository.addMovie({
                titulo,
                sinopse,
                duracao: parseInt(duracao),
                dataLancamento: new Date(dataLancamento),
                imagem,
                categorias
            });
            logger.info(`User ${res.locals.userId || 'unknown'} added the movie ${movie._id} at ${new Date()}.`);
            res.status(201).json(movie);
        } catch (error) {
            logger.error(`Error adding movie: ${error.message}`);
            next(error);
        }
    };

    const deleteMovie = async (req, res, next) => {
        try {
            const id = req.params.id;
            await repository.deleteMovie(id);
            logger.info(`User ${res.locals.userId} deleted the movie ${id} at ${new Date()}.`);
            res.sendStatus(200);
        } catch (error) {
            logger.error(`Error deleting movie: ${error.message}`);
            next(error);
        }
    };

    return {
        getPremieres,
        getMovieById,
        getAllMovies,
        addMovie,
        deleteMovie
    };
};