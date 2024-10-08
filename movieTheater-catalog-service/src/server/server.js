require('express-async-errors');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

let server = null;

async function start(api, repository) {
    const app = express();
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(express.json());

    app.get('/health', (req, res, next) => {
        res.send(`The service ${process.env.MS_NAME} is running at ${process.env.PORT} port`)
    })

    api(app, repository); 

    app.use((error, req, res, next) => {
        console.error(error);
        res.sendStatus(500);
    });

    server = app.listen(process.env.PORT, () => {
        console.log(`Service ${process.env.MS_NAME} has been started at ${process.env.PORT} port.`);
    });
    return server;
}

async function stop() {
    if(server) await server.close();
    return true;
}

module.exports = {
    start,
    stop
}