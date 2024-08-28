const { doLogin, doLogout } = require('../controllers/authController');
const { userRepository, tokenBlacklistRepository } = require('../repository/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sinon = require('sinon');

describe('AuthController', () => {
    
    describe('doLogin', () => {
        let req, res, user;

        beforeEach(() => {
            req = {
                body: {
                    email: 'testuser@example.com',
                    password: 'testpassword'
                }
            };
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            user = {
                _id: 'user-id-123',
                profileId: 'profile-id-456',
                password: bcrypt.hashSync('testpassword', 8)
            };

            sinon.stub(userRepository, 'getUser').resolves(user);
            sinon.stub(jwt, 'sign').returns('fake-jwt-token');
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return a token if the user is authenticated successfully', async () => {
            await doLogin(req, res);

            expect(userRepository.getUser.calledOnceWith(req.body.email)).toBe(true);
            expect(jwt.sign.calledOnce).toBe(true);
            expect(res.status.calledWith(200)).toBe(true);
            expect(res.json.calledWith({ token: 'fake-jwt-token' })).toBe(true);
        });

        it('should return 401 if the user does not exist', async () => {
            userRepository.getUser.resolves(null);

            await doLogin(req, res);

            expect(res.status.calledWith(401)).toBe(true);
            expect(res.json.calledWith({ error: 'Wrong USER and/or PASSWORD' })).toBe(true);
        });

        it('should return 401 if the password is incorrect', async () => {
            user.password = bcrypt.hashSync('wrongpassword', 8); // Incorrect password

            await doLogin(req, res);

            expect(res.status.calledWith(401)).toBe(true);
            expect(res.json.calledWith({ error: 'Wrong USER and/or PASSWORD' })).toBe(true);
        });

        it('should return 500 if there is an unexpected error', async () => {
            userRepository.getUser.rejects(new Error('Unexpected Error'));

            await doLogin(req, res);

            expect(res.status.calledWith(500)).toBe(true);
            expect(res.json.calledWith({ error: 'Internal Server Error' })).toBe(true);
        });
    });

    describe('doLogout', () => {
        let req, res;

        beforeEach(() => {
            req = {
                headers: {
                    'authorization': 'Bearer fake-jwt-token'
                }
            };
            res = {
                sendStatus: sinon.stub()
            };

            sinon.stub(tokenBlacklistRepository, 'addTokenToBlacklist').resolves();
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should add the token to the blacklist and return status 200', async () => {
            await doLogout(req, res);

            expect(tokenBlacklistRepository.addTokenToBlacklist.calledOnceWith('fake-jwt-token')).toBe(true);
            expect(res.sendStatus.calledWith(200)).toBe(true);
        });
    });

});