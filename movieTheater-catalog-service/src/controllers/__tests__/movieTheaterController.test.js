const express = require('express');
const request = require('supertest');
const movieTheaterController = require('../movieTheaterController');
const { getMovieSessionByCinemaId, getMovieSessionByCityId, getMoviesByCinemaId, getMoviesByCityId, simulateNotFound, simulateError } = require('../../repository/__mocks__/movieTheatersMock');

const app = express();
app.use(express.json());

const mockRepository = {
  getMovieSessionByCinemaId,
  getMovieSessionByCityId,
  getMoviesByCinemaId,
  getMoviesByCityId
};

app.get('/sessions/cinema/:cinemaId/:movieId', movieTheaterController(mockRepository).getMovieSessionsByCinema);
app.get('/sessions/city/:cityId/:movieId', movieTheaterController(mockRepository).getMovieSessionsByCity);
app.get('/movies/cinema/:cinemaId', movieTheaterController(mockRepository).getMoviesByCinema);
app.get('/movies/city/:cityId', movieTheaterController(mockRepository).getMoviesByCity);

describe('Movie Theater Controller', () => {
  beforeEach(() => {
    simulateNotFound.movieSessionsByCinema = false;
    simulateNotFound.movieSessionsByCity = false;
    simulateNotFound.moviesByCinema = false;
    simulateNotFound.moviesByCity = false;

    simulateError.movieSessionsByCinema = false;
    simulateError.movieSessionsByCity = false;
    simulateError.moviesByCinema = false;
    simulateError.moviesByCity = false;
  });

  test('should return movie sessions by cinema ID', async () => {
    const response = await request(app).get('/sessions/cinema/1/100');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { session: 'Session 1', cinemaId: '1', movieId: '100' },
      { session: 'Session 2', cinemaId: '1', movieId: '100' }
    ]);
  });

  test('should return 404 if no movie sessions by cinema ID are found', async () => {
    simulateNotFound.movieSessionsByCinema = true;
    const response = await request(app).get('/sessions/cinema/1/100');
    expect(response.status).toBe(404);
  });

  test('should handle error when fetching movie sessions by cinema ID', async () => {
    simulateError.movieSessionsByCinema = true;
    const response = await request(app).get('/sessions/cinema/1/100');
    expect(response.status).toBe(500);
  });

  test('should return movie sessions by city ID', async () => {
    const response = await request(app).get('/sessions/city/2/200');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { session: 'Session A', cityId: '2', movieId: '200' },
      { session: 'Session B', cityId: '2', movieId: '200' }
    ]);
  });

  test('should return 404 if no movie sessions by city ID are found', async () => {
    simulateNotFound.movieSessionsByCity = true;
    const response = await request(app).get('/sessions/city/2/200');
    expect(response.status).toBe(404);
  });

  test('should handle error when fetching movie sessions by city ID', async () => {
    simulateError.movieSessionsByCity = true;
    const response = await request(app).get('/sessions/city/2/200');
    expect(response.status).toBe(500);
  });

  test('should return movies by cinema ID', async () => {
    const response = await request(app).get('/movies/cinema/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { title: 'Movie 1', cinemaId: '1' },
      { title: 'Movie 2', cinemaId: '1' }
    ]);
  });

  test('should return 404 if no movies by cinema ID are found', async () => {
    simulateNotFound.moviesByCinema = true;
    const response = await request(app).get('/movies/cinema/1');
    expect(response.status).toBe(404);
  });

  test('should handle error when fetching movies by cinema ID', async () => {
    simulateError.moviesByCinema = true;
    const response = await request(app).get('/movies/cinema/1');
    expect(response.status).toBe(500);
  });

  test('should return movies by city ID', async () => {
    const response = await request(app).get('/movies/city/2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { title: 'Movie A', cityId: '2' },
      { title: 'Movie B', cityId: '2' }
    ]);
  });

  test('should return 404 if no movies by city ID are found', async () => {
    simulateNotFound.moviesByCity = true;
    const response = await request(app).get('/movies/city/2');
    expect(response.status).toBe(404);
  });

  test('should handle error when fetching movies by city ID', async () => {
    simulateError.moviesByCity = true;
    const response = await request(app).get('/movies/city/2');
    expect(response.status).toBe(500);
  });
});
