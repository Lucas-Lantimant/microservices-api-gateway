const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { validateBlacklist, validateToken } = require('../middlewares/authMiddleware');
const repository = require('../repository/tokenBlacklistRepository');

describe('AuthMiddleware', () => {
    
    describe('validateBlacklist', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                headers: {
                    'authorization': 'Bearer fake-jwt-token'
                }
            };
            res = {
                sendStatus: sinon.stub()
            };
            next = sinon.stub();
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should call next if no token is provided', async () => {
            req.headers['authorization'] = null;

            await validateBlacklist(req, res, next);

            expect(next.calledOnce).toBe(true);
        });

        it('should return 401 if the token is blacklisted', async () => {
            sinon.stub(repository, 'isTokenBlacklisted').resolves(true);

            await validateBlacklist(req, res, next);

            expect(repository.isTokenBlacklisted.calledOnceWith('fake-jwt-token')).toBe(true);
            expect(res.sendStatus.calledWith(401)).toBe(true);
            expect(next.called).toBe(false);
        });

        it('should call next if the token is not blacklisted', async () => {
            sinon.stub(repository, 'isTokenBlacklisted').resolves(false);

            await validateBlacklist(req, res, next);

            expect(repository.isTokenBlacklisted.calledOnceWith('fake-jwt-token')).toBe(true);
            expect(next.calledOnce).toBe(true);
            expect(res.sendStatus.called).toBe(false);
        });

        it('should return 500 if there is an error checking the blacklist', async () => {
            sinon.stub(repository, 'isTokenBlacklisted').rejects(new Error('Unexpected Error'));

            await validateBlacklist(req, res, next);

            expect(repository.isTokenBlacklisted.calledOnceWith('fake-jwt-token')).toBe(true);
            expect(res.sendStatus.calledWith(500)).toBe(true);
            expect(next.called).toBe(false);
        });
    });

    describe('validateToken', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                headers: {
                    'authorization': 'Bearer fake-jwt-token'
                }
            };
            res = {
                sendStatus: sinon.stub(),
                locals: {}
            };
            next = sinon.stub();
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return 401 if no token is provided', async () => {
            req.headers['authorization'] = null;

            await validateToken(req, res, next);

            expect(res.sendStatus.calledWith(401)).toBe(true);
            expect(next.called).toBe(false);
        });

        it('should verify the token and call next if valid', async () => {
            const decodedToken = { userId: 'user-id-123', profileId: 'profile-id-456' };
            sinon.stub(jwt, 'verify').returns(decodedToken);

            await validateToken(req, res, next);

            expect(jwt.verify.calledOnceWith('fake-jwt-token', process.env.SECRET)).toBe(true);
            expect(res.locals.userId).toBe(decodedToken.userId);
            expect(res.locals.profileId).toBe(decodedToken.profileId);
            expect(next.calledOnce).toBe(true);
        });

        it('should return 401 if the token is invalid', async () => {
            sinon.stub(jwt, 'verify').throws(new Error('Invalid Token'));

            await validateToken(req, res, next);

            expect(res.sendStatus.calledWith(401)).toBe(true);
            expect(next.called).toBe(false);
        });
    });

});
