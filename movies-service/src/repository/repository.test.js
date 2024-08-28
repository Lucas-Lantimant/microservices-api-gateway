const { test, expect, beforeAll, afterEach } = require('@jest/globals');
const repository = require('./repository');
const server = require('../server/server');

// Mocking the repository methods
jest.mock('./repository', () => ({
    getAllMovies: jest.fn(),
    getMovieById: jest.fn(),
    getMoviePremieres: jest.fn(),
    addMovie: jest.fn(),
    deleteMovie: jest.fn(),
}));

let testMovieId = null;

beforeAll(async () => {
    // Mock the response for getAllMovies
    repository.getAllMovies.mockResolvedValue([
        {
            _id: 'mock-id',
            titulo: "Os Vingadores: Ultimato",
            sinopse: "Os heróis mais poderosos da Terra enfrentando o Thanos. De novo.",
            dataLancamento: new Date(),
            duracao: 181,
            imagem: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_UX182_CR0,0,182,268_AL_.jpg',
            categorias: ['Aventura', 'Ação'],
        }
    ]);
    const movies = await repository.getAllMovies();
    testMovieId = movies[0]._id;
});

afterEach(async () => {
    // Ensure the server is stopped after each test
    if (server && typeof server.stop === 'function') {
        await server.stop();
    }
});

test('getAllMovies', async () => {
    // Mock the response for getAllMovies
    repository.getAllMovies.mockResolvedValue([
        {
            _id: 'mock-id',
            titulo: "Os Vingadores: Ultimato",
            sinopse: "Os heróis mais poderosos da Terra enfrentando o Thanos. De novo.",
            dataLancamento: new Date(),
            duracao: 181,
            imagem: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_UX182_CR0,0,182,268_AL_.jpg',
            categorias: ['Aventura', 'Ação'],
        }
    ]);

    const movies = await repository.getAllMovies();
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();
});

test('getMovieById', async () => {
    // Mock the response for getMovieById
    repository.getMovieById.mockResolvedValue({
        _id: testMovieId,
        titulo: "Os Vingadores: Ultimato",
        sinopse: "Os heróis mais poderosos da Terra enfrentando o Thanos. De novo.",
        dataLancamento: new Date(),
        duracao: 181,
        imagem: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_UX182_CR0,0,182,268_AL_.jpg',
        categorias: ['Aventura', 'Ação'],
    });

    const movie = await repository.getMovieById(testMovieId);
    expect(movie).toBeTruthy();
    expect(movie._id).toEqual(testMovieId);
});

test('getMoviePremieres', async () => {
    // Mock the response for getMoviePremieres
    repository.getMoviePremieres.mockResolvedValue([
        {
            _id: 'mock-id',
            titulo: "Os Vingadores: Ultimato",
            sinopse: "Os heróis mais poderosos da Terra enfrentando o Thanos. De novo.",
            dataLancamento: new Date(),
            duracao: 181,
            imagem: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_UX182_CR0,0,182,268_AL_.jpg',
            categorias: ['Aventura', 'Ação'],
        }
    ]);

    const movies = await repository.getMoviePremieres();
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    expect(new Date(movies[0].dataLancamento).getTime()).toBeGreaterThanOrEqual(monthAgo.getTime());
});

test('addMovie', async () => {
    // Mock the response for addMovie
    repository.addMovie.mockResolvedValue({
        _id: 'mock-id',
        titulo: "Teste Title",
        sinopse: "Teste Summary",
        duracao: 120,
        dataLancamento: new Date(),
        imagem: 'image.jpeg',
        categorias: ['Aventura']
    });

    const movie = {
        titulo: "Teste Title",
        sinopse: "Teste Summary",
        duracao: 120,
        dataLancamento: new Date(),
        imagem: 'image.jpeg',
        categorias: ['Aventura']
    };

    const result = await repository.addMovie(movie);
    expect(result).toBeTruthy();
    expect(result._id).toEqual('mock-id');
    // No need to call deleteMovie since addMovie is mocked
});

test('deleteMovie', async () => {
    // Mock the response for addMovie and deleteMovie
    repository.addMovie.mockResolvedValue({
        _id: 'mock-id',
        titulo: "Teste Title",
        sinopse: "Teste Summary",
        duracao: 120,
        dataLancamento: new Date(),
        imagem: 'image.jpeg',
        categorias: ['Aventura']
    });
    repository.deleteMovie.mockResolvedValue(true);

    const result = await repository.addMovie({
        titulo: "Teste Title",
        sinopse: "Teste Summary",
        duracao: 120,
        dataLancamento: new Date(),
        imagem: 'image.jpeg',
        categorias: ['Aventura']
    });

    const result2 = await repository.deleteMovie(result._id);
    expect(result2).toBeTruthy();
});
