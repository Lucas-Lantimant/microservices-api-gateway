const { test, expect, beforeAll } = require('@jest/globals');
const repository = require('./repository');

let cityId = null;
let cinemaId = null;
let movieId =null

beforeAll( async () => {
    const cities = await repository.getAllCities();
    cityId = cities[cities.length - 1]._id;
    
    const cinemas =  await repository.getCinemasByCityId(cityId);
    cinemaId = cinemas[0]._id;
    movieId = cinemas[0].salas[0].sessoes[0].idFilme;
});

test('getAllMovies', async () => {
    const cities = await repository.getAllCities();
    expect(Array.isArray(cities)).toBeTruthy();
    expect(cities.length).toBeTruthy();
});

test('getCinemasByCityId', async () => {
    const cinemas = await repository.getCinemasByCityId(cityId);
    expect(Array.isArray(cinemas)).toBeTruthy();
});

test('getMoviesByCinemaId', async () => {
    const movies = await repository.getMoviesByCinemaId(cinemaId);
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();
     
});

test('getMoviesByCityId', async () => {
    const movies = await repository.getMoviesByCityId(cityId);
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();
});

test('getMovieSessionByCityId', async () => {
    const movieSessions = await repository.getMovieSessionByCityId(movieId, cityId);
    expect(Array.isArray(movieSessions)).toBeTruthy();
    expect(movieSessions.length).toBeTruthy();
});

test('getMovieSessionByCinemaId', async () => {
    const movieSessions = await repository.getMovieSessionByCinemaId(movieId, cinemaId);
    expect(Array.isArray(movieSessions)).toBeTruthy();
    expect(movieSessions.length).toBeTruthy();
});