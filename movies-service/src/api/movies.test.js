const request = require('supertest');
const express = require('express');
const { api } = require('../repository/__mocks__/repository');

let app = null;

beforeEach(async () => {
    app = express();
    app.use(express.json());
    api(app, require('../repository/__mocks__/repository')); 
});

afterEach(async () => {
    app = null; 
});

test('GET /movies with simulateAuthentication 200 OK', async () => {
    const response = await request(app)
        .get('/movies')
        .set('Content-Type', 'application/json');

    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('titulo', 'Os Vingadores: Ultimato');
});

test('GET /movies with simulateAuthentication 401 Unauthorized', async () => {
    require('../repository/__mocks__/repository').simulateNotFound.allMovies = true; 
    const response = await request(app)
        .get('/movies')
        .set('Content-Type', 'application/json');

    expect(response.status).toEqual(404); 
});