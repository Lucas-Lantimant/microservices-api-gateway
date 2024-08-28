const simulateAuthentication = (req, next) => {
    req.user = { id: 'test-user' };
    next();
};

const validateToken = (next) => {
    next();
};

module.exports = { simulateAuthentication, validateToken };
