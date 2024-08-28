const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { validateToken } = require('./validationMiddleware'); 

const app = express();
app.use(express.json());

const SECRET = 'test-secret-key';
process.env.SECRET = SECRET;

app.get('/protected', validateToken, (req, res) => {
    res.json({ message: 'Access granted', userId: res.locals.userId });
});

describe('validateToken middleware', () => {
    let validToken;
    let invalidToken = 'invalid-token';

    beforeAll(() => {
        validToken = jwt.sign({ userId: 123 }, SECRET, { expiresIn: '1h' });
    });

    test('should return 401 if no token is provided', async () => {
        const res = await request(app).get('/protected');
        expect(res.statusCode).toBe(401);
    });

    test('should return 401 if token is invalid', async () => {
        const res = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${invalidToken}`);
        expect(res.statusCode).toBe(401);
    });

    test('should return 200 and userId if token is valid', async () => {
        const res = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${validToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Access granted');
        expect(res.body.userId).toBe(123);
    });

    test('should return 401 if token is expired', async () => {
        const expiredToken = jwt.sign({ userId: 123 }, SECRET, { expiresIn: '-1s' });
        const res = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${expiredToken}`);
        expect(res.statusCode).toBe(401);
    });
});
