const logger = require('../config/logger');

function logUnauthorizedAccess(req, res, next) {
    res.on('finish', () => {
        if (res.statusCode === 401) {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const userId = res.locals.userId || 'unknown';
            logger.warn(`Unauthorized access attempt: ${req.method} ${req.originalUrl} from IP ${ip}, User ID: ${userId}`);
        }
    });
    next();
}

function logForbiddenAccess(req, res, next) {
    res.on('finish', () => {
        if (res.statusCode === 403) {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const userId = res.locals.userId || 'unknown';
            logger.warn(`Forbidden access attempt: ${req.method} ${req.originalUrl} from IP ${ip}, User ID: ${userId}`);
        }
    });
    next();
}

module.exports = {
    logUnauthorizedAccess,
    logForbiddenAccess
};








/*
const logger = require('../config/logger');

// Middleware para log de acesso não autorizado
function logUnauthorizedAccess(req, res, next) {
    res.on('finish', () => {
        if (res.statusCode === 401) {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const userId = res.locals.userId || 'unknown';
            logger.warn(`Unauthorized access attempt: ${req.method} ${req.originalUrl} from IP ${ip}, User ID: ${userId}`);
        }
    });
    next();
}

// Middleware para log de acesso proibido
function logForbiddenAccess(req, res, next) {
    res.on('finish', () => {
        if (res.statusCode === 403) {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const userId = res.locals.userId || 'unknown';
            logger.warn(`Forbidden access attempt: ${req.method} ${req.originalUrl} from IP ${ip}, User ID: ${userId}`);
        }
    });
    next();
}

module.exports = {
    logUnauthorizedAccess,
    logForbiddenAccess
};
*/
