const schema = require('../schemas/movieSchema');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const ADIMIN_PROFILE = 1;

function validateMovie(req, res, next) {
    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(422).json({ message: error.details[0].message });
    }

    next();
}

function validateToken(req, res, next) {
    let token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);
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

function validateAmin(req, res, next) {
    const { profileId } = res.locals;
    if(profileId === ADIMIN_PROFILE) {
        next();
    } else {
        logger.warn(`The user ${res.locals.userId}-${res.locals.userProfile}`)
        res.sendStatus(403);
    }
}

module.exports = {
    validateMovie,
    validateToken,
    validateAmin
};