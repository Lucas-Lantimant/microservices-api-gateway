const express = require('express');
const request = require('supertest');
const citiesController = require('../citiesController');
const { getAllCities, getCinemasByCityId, simulateNotFound, simulateError } = require('../../repository/__mocks__/citiesMock');

const app = express();
app.use(express.json());

const mockRepository = {
  getAllCities,
  getCinemasByCityId
};

const controller = citiesController(mockRepository);

app.get('/cities', controller.getAllCities);
app.get('/cities/:cityId/cinemas', controller.getCinemasByCity);

describe('Cities Controller', () => {
  beforeEach(() => {
    simulateNotFound.allCities = false;
    simulateNotFound.cityId = false;
    simulateError.allCities = false;
    simulateError.cityId = false;
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
    simulateNotFound.allCities = true;
    const response = await request(app).get('/cities');
    expect(response.status).toBe(404);
  });

  test('should handle error when fetching all cities', async () => {
    simulateError.allCities = true;
    const response = await request(app).get('/cities');
    expect(response.status).toBe(500);
  });

  test('should return cinemas by city ID', async () => {
    const response = await request(app).get('/cities/2/cinemas');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { nome: 'Cinemark Bourbon Ipiranga', cityId: '2' },
      { nome: 'Cinemark Iguatemi', cityId: '2' }
    ]);
  });

  test('should return 404 if city ID not found', async () => {
    simulateNotFound.cityId = true;
    const response = await request(app).get('/cities/2/cinemas');
    expect(response.status).toBe(404);
  });

  test('should handle error when fetching cinemas by city ID', async () => {
    simulateError.cityId = true;
    const response = await request(app).get('/cities/2/cinemas');
    expect(response.status).toBe(500);
  });
});
