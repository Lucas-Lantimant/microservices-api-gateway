const { test, expect, beforeEach, afterEach } = require('@jest/globals');
const request = require('supertest');
const server = require('./server');

const apiMock = jest.fn((app, repository) => {
    app.get('/error', (req, res, next) => {
        next(new Error('Test error'));
    });
});

let app;

beforeEach(async () => {
    app = await server.start(apiMock);
});

afterEach(async () => {
    await server.stop();
});

test('Server Start', async () => {
    expect(app).toBeTruthy();
});

test('Health Check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toEqual(200);
});

test('Error Handling Middleware', async () => {
    const response = await request(app).get('/error');
    expect(response.status).toEqual(500); 
});
