const { connect, disconnect } = require('./database');
const { MongoClient } = require('mongodb');

jest.mock('mongodb', () => {
    const mDb = { collection: jest.fn() };
    const mClient = {
        connect: jest.fn(),
        close: jest.fn(),
        db: jest.fn().mockReturnValue(mDb),
    };
    return {
        MongoClient: jest.fn(() => mClient),
    };
});

describe('Database Connection', () => {
    let mockClient;

    beforeAll(() => {
        mockClient = new MongoClient();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Connecting Database', async () => {
        mockClient.connect.mockResolvedValue(mockClient);
        const db = await connect();
        expect(db).toBeDefined();
        expect(mockClient.connect).toHaveBeenCalled();
    });

    test('Disconnecting Database when client exists', async () => {
        mockClient.connect.mockResolvedValue(mockClient);
        await connect();
        await disconnect();
        expect(mockClient.close).toHaveBeenCalled();
    });

    test('Disconnecting Database when client does not exist', async () => {
        await disconnect();
        expect(mockClient.close).not.toHaveBeenCalled();
    });
});