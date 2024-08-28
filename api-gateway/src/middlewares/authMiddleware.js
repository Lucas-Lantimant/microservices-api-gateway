const jwt = require('jsonwebtoken');
const repository = require('../repository/tokenBlacklistRepository');

async function validateBlacklist(req, res, next) {
    let token = req.headers['authorization'];

    if (!token) {
        console.log("No token provided, continuing.");
        return next();
    }

    token = token.replace('Bearer', '').trim();

    try {
        const isBlacklisted = await repository.isTokenBlacklisted(token);
        console.log("Token is blacklisted:", isBlacklisted);
        
        if (isBlacklisted) {
            console.log("Token is blacklisted, returning 401.");
            return res.sendStatus(401);
        } else {
            console.log("Token is not blacklisted, proceeding.");
            return next();
        }
    } catch (error) {
        console.error("Error checking blacklist:", error);
        return res.sendStatus(500);
    }
}

async function validateToken(req, res, next) {
    let token = req.headers['authorization'];
    if (!token)
        return res.sendStatus(401);
    token = token.replace('Bearer', '').trim();

    try {
        const { userId, profileId } = jwt.verify(token, process.env.SECRET);
        res.locals.userId = userId;
        res.locals.profileId = profileId;
        next();
    } catch (err) {
        console.error(err);
        res.sendStatus(401);
    }
}

module.exports = {
    validateBlacklist,
    validateToken
}