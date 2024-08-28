const sinon = require('sinon');
const database = require('../../config/database');
const { addTokenToBlacklist, isTokenBlacklisted } = require('../tokenBlacklistRepository');

describe('TokenBlacklistRepository', () => {
    let db, collectionStub;

    beforeEach(async () => {
        db = {
            collection: sinon.stub()
        };
        collectionStub = {
            insertOne: sinon.stub(),
            countDocuments: sinon.stub()
        };
        db.collection.returns(collectionStub);

        sinon.stub(database, 'connect').resolves(db);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('addTokenToBlacklist', () => {
        it('should insert a token into the blacklist collection', async () => {
            const token = 'fake-token';
            await addTokenToBlacklist(token);

            expect(db.collection.calledOnceWith('blacklist')).toBe(true);
            expect(collectionStub.insertOne.calledOnceWith({ _id: token, date: sinon.match.date })).toBe(true);
        });
    });

    describe('isTokenBlacklisted', () => {
        it('should return true if the token is blacklisted', async () => {
            const token = 'fake-token';
            collectionStub.countDocuments.resolves(1);  // Token is blacklisted

            const result = await isTokenBlacklisted(token);

            expect(db.collection.calledOnceWith('blacklist')).toBe(true);
            expect(collectionStub.countDocuments.calledOnceWith({ _id: token })).toBe(true);
            expect(result).toBe(true);
        });

        it('should return false if the token is not blacklisted', async () => {
            const token = 'fake-token';
            collectionStub.countDocuments.resolves(0);  // Token is not blacklisted

            const result = await isTokenBlacklisted(token);

            expect(db.collection.calledOnceWith('blacklist')).toBe(true);
            expect(collectionStub.countDocuments.calledOnceWith({ _id: token })).toBe(true);
            expect(result).toBe(false);
        });
    });
});