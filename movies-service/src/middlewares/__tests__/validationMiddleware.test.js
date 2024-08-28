const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { validateMovie, validateToken, validateAmin } = require('../validationMiddleware');
const logger = require('../../config/logger');
const schema = require('../../schemas/movieSchema');

jest.mock('jsonwebtoken');
jest.mock('../../config/logger');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
    console.error.mockRestore();
});

const app = express();
app.use(express.json());

const mockHandler = (req, res) => res.status(200).json({ message: 'Success' });

app.post('/validateMovie', validateMovie, mockHandler);
app.post('/validateToken', validateToken, mockHandler);
app.post('/validateAmin', validateToken, validateAmin, mockHandler);

describe('Middleware Tests', () => {
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('validateMovie', () => {
        it('should return 422 if validation fails', async () => {
            schema.validate = jest.fn().mockReturnValue({ error: { details: [{ message: 'Invalid data' }] } });

            const res = await request(app)
                .post('/validateMovie')
                .send({});

            expect(res.status).toBe(422);
            expect(res.body.message).toBe('Invalid data');
            expect(schema.validate).toHaveBeenCalledTimes(1);
        });

        it('should proceed to next middleware if validation passes', async () => {
            schema.validate = jest.fn().mockReturnValue({ error: null });

            const res = await request(app)
                .post('/validateMovie')
                .send({ title: 'Valid Movie' });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Success');
            expect(schema.validate).toHaveBeenCalledTimes(1);
        });
    });

    describe('validateToken', () => {
        it('should return 401 if token is missing', async () => {
            const res = await request(app)
                .post('/validateToken')
                .send({});

            expect(res.status).toBe(401);
        });

        it('should return 401 if token is invalid', async () => {
            jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

            const res = await request(app)
                .post('/validateToken')
                .set('Authorization', 'Bearer invalidtoken')
                .send({});

            expect(res.status).toBe(401);
            expect(jwt.verify).toHaveBeenCalledTimes(1);
        });

        it('should proceed to next middleware if token is valid', async () => {
            jwt.verify.mockReturnValue({ userId: 1, profileId: 1 });

            const res = await request(app)
                .post('/validateToken')
                .set('Authorization', 'Bearer validtoken')
                .send({});

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Success');
            expect(jwt.verify).toHaveBeenCalledTimes(1);
        });
    });

    describe('validateAmin', () => {
        it('should return 403 if user is not an admin', async () => {
            jwt.verify.mockReturnValue({ userId: 1, profileId: 2 });

            const res = await request(app)
                .post('/validateAmin')
                .set('Authorization', 'Bearer validtoken')
                .send({});

            expect(res.status).toBe(403);
            expect(logger.warn).toHaveBeenCalledWith('The user 1-undefined');
            expect(jwt.verify).toHaveBeenCalledTimes(1);
        });

        it('should proceed to next middleware if user is an admin', async () => {
            jwt.verify.mockReturnValue({ userId: 1, profileId: 1 });

            const res = await request(app)
                .post('/validateAmin')
                .set('Authorization', 'Bearer validtoken')
                .send({});

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Success');
            expect(jwt.verify).toHaveBeenCalledTimes(1);
        });
    });
});
