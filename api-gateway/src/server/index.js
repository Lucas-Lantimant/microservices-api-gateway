const express = require('express');
const httpProxy = require('express-http-proxy');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const options = {
    proxyReqPathResolver: (req) => req.originalUrl,
    proxyReqBodyDecorator: (bodyContent, srcReq) => {
        if (srcReq.headers['content-type'] === 'application/json') {
            return JSON.stringify(bodyContent);
        }
        return bodyContent;
    }
}

app.post('/login', authController.doLogin);
app.use(authMiddleware.validateBlacklist);
app.post('/logout', authMiddleware.validateToken, authController.doLogout);

const moviesServiceProxy = httpProxy(process.env.MOVIES_API, options);
const catalogServiceProxy = httpProxy(process.env.CATALOG_API, options);

app.use('/movies', moviesServiceProxy);
app.get(/\/cities|\/cinemas/i, catalogServiceProxy);

app.listen(process.env.PORT, () => {
    console.log(`API Gateway has been started at ${process.env.PORT} port.`);
});