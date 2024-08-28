const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser'); 
const createController = require('../controllers/moviesController');

const mockRepository = {
    getMoviePremieres: jest.fn(),
    getMovieById: jest.fn(),
    getAllMovies: jest.fn(),
    addMovie: jest.fn(),
    deleteMovie: jest.fn(),
};

const app = express();
app.use(bodyParser.json());

const controller = createController(mockRepository);
app.get('/premieres', controller.getPremieres);
app.get('/movies/:id', controller.getMovieById);
app.get('/movies', controller.getAllMovies);
app.post('/movies', controller.addMovie);
app.delete('/movies/:id', controller.deleteMovie);

describe('Movie Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getPremieres', () => {
        it('should return 404 if no movies are found', async () => {
            mockRepository.getMoviePremieres.mockResolvedValue([]);

            const res = await request(app).get('/premieres');

            expect(res.status).toBe(404);
            expect(mockRepository.getMoviePremieres).toHaveBeenCalledTimes(1);
        });

        it('should return movies if found', async () => {
            const movies = [{ id: 1, title: 'Movie 1' }];
            mockRepository.getMoviePremieres.mockResolvedValue(movies);

            const res = await request(app).get('/premieres');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(movies);
            expect(mockRepository.getMoviePremieres).toHaveBeenCalledTimes(1);
        });

        it('should return 500 if an error occurs while fetching premieres', async () => {
            mockRepository.getMoviePremieres.mockRejectedValue(new Error('DB error'));

            const res = await request(app).get('/premieres');

            expect(res.status).toBe(500);
            expect(mockRepository.getMoviePremieres).toHaveBeenCalledTimes(1);
        });
    });

    describe('getMovieById', () => {
        it('should return 404 if movie is not found', async () => {
            mockRepository.getMovieById.mockResolvedValue(null);

            const res = await request(app).get('/movies/1');

            expect(res.status).toBe(404);
            expect(mockRepository.getMovieById).toHaveBeenCalledTimes(1);
            expect(mockRepository.getMovieById).toHaveBeenCalledWith('1');
        });

        it('should return the movie if found', async () => {
            const movie = { id: 1, title: 'Movie 1' };
            mockRepository.getMovieById.mockResolvedValue(movie);

            const res = await request(app).get('/movies/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(movie);
            expect(mockRepository.getMovieById).toHaveBeenCalledTimes(1);
            expect(mockRepository.getMovieById).toHaveBeenCalledWith('1');
        });

        it('should return 500 if an error occurs while fetching the movie by ID', async () => {
            mockRepository.getMovieById.mockRejectedValue(new Error('DB error'));

            const res = await request(app).get('/movies/1');

            expect(res.status).toBe(500);
            expect(mockRepository.getMovieById).toHaveBeenCalledTimes(1);
            expect(mockRepository.getMovieById).toHaveBeenCalledWith('1');
        });
    });

    describe('getAllMovies', () => {
        it('should return 404 if no movies are found', async () => {
            mockRepository.getAllMovies.mockResolvedValue([]);

            const res = await request(app).get('/movies');

            expect(res.status).toBe(404);
            expect(mockRepository.getAllMovies).toHaveBeenCalledTimes(1);
        });

        it('should return all movies if found', async () => {
            const movies = [{ id: 1, title: 'Movie 1' }, { id: 2, title: 'Movie 2' }];
            mockRepository.getAllMovies.mockResolvedValue(movies);

            const res = await request(app).get('/movies');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(movies);
            expect(mockRepository.getAllMovies).toHaveBeenCalledTimes(1);
        });

        it('should return 500 if an error occurs while fetching all movies', async () => {
            mockRepository.getAllMovies.mockRejectedValue(new Error('DB error'));

            const res = await request(app).get('/movies');

            expect(res.status).toBe(500);
            expect(mockRepository.getAllMovies).toHaveBeenCalledTimes(1);
        });
    });

    describe('addMovie', () => {
        it('should add a new movie and return it with status 201', async () => {
            const movieData = {
                titulo: 'New Movie',
                sinopse: 'Some synopsis',
                duracao: '120',
                dataLancamento: '2024-01-01',
                imagem: 'image-url',
                categorias: ['Action', 'Drama']
            };
            const savedMovie = { ...movieData, _id: '1' };
            mockRepository.addMovie.mockResolvedValue(savedMovie);

            const res = await request(app)
                .post('/movies')
                .send(movieData);

            expect(res.status).toBe(201);
            expect(res.body).toEqual(savedMovie);
            expect(mockRepository.addMovie).toHaveBeenCalledTimes(1);
            expect(mockRepository.addMovie).toHaveBeenCalledWith({
                ...movieData,
                duracao: 120,
                dataLancamento: new Date(movieData.dataLancamento),
            });
        });

        it('should return 500 if an error occurs while adding the movie', async () => {
            mockRepository.addMovie.mockRejectedValue(new Error('DB error'));

            const res = await request(app)
                .post('/movies')
                .send({
                    titulo: 'New Movie',
                    sinopse: 'Some synopsis',
                    duracao: '120',
                    dataLancamento: '2024-01-01',
                    imagem: 'image-url',
                    categorias: ['Action', 'Drama']
                });

            expect(res.status).toBe(500);
            expect(mockRepository.addMovie).toHaveBeenCalledTimes(1);
        });
    });

    describe('deleteMovie', () => {
        it('should delete the movie and return status 204', async () => {
            mockRepository.deleteMovie.mockResolvedValue();

            const res = await request(app).delete('/movies/1');

            expect(res.status).toBe(200);
            expect(mockRepository.deleteMovie).toHaveBeenCalledTimes(1);
            expect(mockRepository.deleteMovie).toHaveBeenCalledWith('1');
        });

        it('should return 500 if an error occurs while deleting the movie', async () => {
            mockRepository.deleteMovie.mockRejectedValue(new Error('DB error'));

            const res = await request(app).delete('/movies/1');

            expect(res.status).toBe(500);
            expect(mockRepository.deleteMovie).toHaveBeenCalledTimes(1);
            expect(mockRepository.deleteMovie).toHaveBeenCalledWith('1');
        });
    });
});
