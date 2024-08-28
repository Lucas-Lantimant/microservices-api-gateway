const sinon = require('sinon');
const database = require('../../config/database');
const userRepository = require('../userRepository');

describe('UserRepository', () => {
    let db, collectionStub;

    beforeEach(async () => {
        db = {
            collection: sinon.stub()
        };
        collectionStub = {
            findOne: sinon.stub()
        };
        db.collection.returns(collectionStub);

        sinon.stub(database, 'connect').resolves(db);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getUser', () => {
        it('should return the user when a valid email is provided', async () => {
            const email = 'testuser@example.com';
            const expectedUser = { _id: 'user-id-123', email };
            collectionStub.findOne.resolves(expectedUser);

            const result = await userRepository.getUser(email);

            expect(db.collection.calledOnceWith('users')).toBe(true);
            expect(collectionStub.findOne.calledOnceWith({ email })).toBe(true);
            expect(result).toEqual(expectedUser);
        });

        it('should return null if no user is found', async () => {
            const email = 'nonexistent@example.com';
            collectionStub.findOne.resolves(null);

            const result = await userRepository.getUser(email);

            expect(db.collection.calledOnceWith('users')).toBe(true);
            expect(collectionStub.findOne.calledOnceWith({ email })).toBe(true);
            expect(result).toBeNull();
        });
    });
});
