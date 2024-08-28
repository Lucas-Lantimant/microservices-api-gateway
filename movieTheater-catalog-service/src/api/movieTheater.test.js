const express = require('express');
const request = require('supertest');
const { getMovieSessionByCinemaId, getMovieSessionByCityId, getMoviesByCinemaId, getMoviesByCityId, simulateNotFound: simulateMovieTheaterNotFound } = require('../repository/__mocks__/movieTheatersMock');
const { getCinemasByCityId, getAllCities, simulateNotFound: simulateCitiesNotFound } = require('../repository/__mocks__/citiesMock');

jest.mock('../middlewares/validationMiddleware', () => ({
  validateToken: (req, res, next) => next() 
}));

const app = express();
app.use(express.json());

const mockRepository = {
  getMovieSessionByCinemaId,
  getMovieSessionByCityId,
  getMoviesByCinemaId,
  getMoviesByCityId,
  getCinemasByCityId,
  getAllCities
};

require('./movieTheaters')(app, mockRepository);

describe('Routes', () => {
  beforeEach(() => {
    simulateMovieTheaterNotFound.movieSessionsByCinema = false;
    simulateMovieTheaterNotFound.movieSessionsByCity = false;
    simulateMovieTheaterNotFound.moviesByCinema = false;
    simulateMovieTheaterNotFound.moviesByCity = false;
    simulateCitiesNotFound.allCities = false;
    simulateCitiesNotFound.cityId = false;
  });

  test('should return movie sessions by cinema ID', async () => {
    const response = await request(app).get('/cinemas/1/movies/100');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { session: 'Session 1', cinemaId: '1', movieId: '100' },
      { session: 'Session 2', cinemaId: '1', movieId: '100' }
    ]);
  });

  test('should return 404 if no movie sessions by cinema ID are found', async () => {
    simulateMovieTheaterNotFound.movieSessionsByCinema = true;
    const response = await request(app).get('/cinemas/1/movies/100');
    expect(response.status).toBe(404);
  });

  test('should return movie sessions by city ID', async () => {
    const response = await request(app).get('/cities/2/movies/200');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { session: 'Session A', cityId: '2', movieId: '200' },
      { session: 'Session B', cityId: '2', movieId: '200' }
    ]);
  });

  test('should return 404 if no movie sessions by city ID are found', async () => {
    simulateMovieTheaterNotFound.movieSessionsByCity = true;
    const response = await request(app).get('/cities/2/movies/200');
    expect(response.status).toBe(404);
  });

  test('should return movies by cinema ID', async () => {
    const response = await request(app).get('/cinemas/1/movies');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { title: 'Movie 1', cinemaId: '1' },
      { title: 'Movie 2', cinemaId: '1' }
    ]);
  });

  test('should return 404 if no movies by cinema ID are found', async () => {
    simulateMovieTheaterNotFound.moviesByCinema = true;
    const response = await request(app).get('/cinemas/1/movies');
    expect(response.status).toBe(404);
  });

  test('should return movies by city ID', async () => {
    const response = await request(app).get('/cities/2/movies');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { title: 'Movie A', cityId: '2' },
      { title: 'Movie B', cityId: '2' }
    ]);
  });

  test('should return 404 if no movies by city ID are found', async () => {
    simulateMovieTheaterNotFound.moviesByCity = true;
    const response = await request(app).get('/cities/2/movies');
    expect(response.status).toBe(404);
  });

  test('should return cinemas by city ID', async () => {
    const response = await request(app).get('/cities/2/cinemas');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { nome: 'Cinemark Bourbon Ipiranga', cityId: '2' },
      { nome: 'Cinemark Iguatemi', cityId: '2' }
    ]);
  });

  test('should return 404 if no cinemas by city ID are found', async () => {
    simulateCitiesNotFound.cityId = true;
    const response = await request(app).get('/cities/2/cinemas');
    expect(response.status).toBe(404);
  });

  test('should return all cities', async () => {
    const response = await request(app).get('/cities');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { cidade: 'Gravataí' },
      { cidade: 'Porto Alegre' }
    ]);
  });

  test('should return 404 if no cities are found', async () => {
    simulateCitiesNotFound.allCities = true;
    const response = await request(app).get('/cities');
    expect(response.status).toBe(404);
  });
});
