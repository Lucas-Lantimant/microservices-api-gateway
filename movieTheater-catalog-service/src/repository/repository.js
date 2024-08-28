const database = require('../config/database');
const { ObjectId } = require('mongodb');

async function getAllCities() {
    const db = await database.connect();
    return db.collection('cinemaCatalog')
        .find({})
        .project({ cidade: 1, uf: 1, pais: 1 })
        .toArray();
}

async function getCinemasByCityId(cityId) {
    const objectCityId = new ObjectId(cityId);
    const db = await database.connect();
    const city = await db.collection('cinemaCatalog')
        .findOne({ _id: objectCityId }, { projection: { cinemas: 1 } });
    return city.cinemas;
}

async function getMoviesByCinemaId(cinemaId) {
    const objectCinemaId = new ObjectId(cinemaId);
    const db = await database.connect();
    const group = await db.collection('cinemaCatalog')
        .aggregate([
            { $match: { "cinemas._id": objectCinemaId } },
            { $unwind: "$cinemas" },
            { $unwind: "$cinemas.salas" },
            { $unwind: "$cinemas.salas.sessoes" },
            {
                $group: {
                    _id: {
                        titulo: "$cinemas.salas.sessoes.filme",
                        _id: "$cinemas.salas.sessoes.idFilme"
                    }
                }
            }
        ])
        .toArray();

    return group.map(g => g._id);
}

async function getMoviesByCityId(cityId) {
    const objectCityId = new ObjectId(cityId);
    const db = await database.connect();
    const group = await db.collection('cinemaCatalog')
        .aggregate([
            { $match: { "_id": objectCityId } },
            { $unwind: "$cinemas" },
            { $unwind: "$cinemas.salas" },
            { $unwind: "$cinemas.salas.sessoes" },
            {
                $group: {
                    _id: {
                        titulo: "$cinemas.salas.sessoes.filme",
                        _id: "$cinemas.salas.sessoes.idFilme"
                    }
                }
            }
        ])
        .toArray();

    return group.map(g => g._id);
}

async function getMovieSessionByCityId(movieId, cityId) {
    const objectMovieId = new ObjectId(movieId);
    const objectCityId = new ObjectId(cityId);
    const db = await database.connect();
    const group = await db.collection('cinemaCatalog')
        .aggregate([
            { $match: { "_id": objectCityId } },
            { $unwind: "$cinemas" },
            { $unwind: "$cinemas.salas" },
            { $unwind: "$cinemas.salas.sessoes" },
            { $match: { "cinemas.salas.sessoes.idFilme": objectMovieId } },
            {
                $group: {
                    _id: {
                        titulo: "$cinemas.salas.sessoes.filme",
                        _id: "$cinemas.salas.sessoes.idFilme",
                        cinema: "$cinemas.nome",
                        idCinema: "$cinemas._id",
                        sala: "$cinemas.salas.nome",
                        sessao: "$cinemas.salas.sessoes"
                    }
                }
            }
        ])
        .toArray();

    return group.map(g => g._id);
}

async function getMovieSessionByCinemaId(movieId, cinemaId) {
    const objectMovieId = new ObjectId(movieId);
    const objectCinemaId = new ObjectId(cinemaId);
    const db = await database.connect();
    const group = await db.collection('cinemaCatalog')
        .aggregate([
            { $match: { "cinemas._id": objectCinemaId } },
            { $unwind: "$cinemas" },
            { $unwind: "$cinemas.salas" },
            { $unwind: "$cinemas.salas.sessoes" },
            { $match: { "cinemas.salas.sessoes.idFilme": objectMovieId } },
            {
                $group: {
                    _id: {
                        titulo: "$cinemas.salas.sessoes.filme",
                        _id: "$cinemas.salas.sessoes.idFilme",
                        cinema: "$cinemas.nome",
                        idCinema: "$cinemas._id",
                        sala: "$cinemas.salas.nome",
                        sessao: "$cinemas.salas.sessoes"
                    }
                }
            }
        ])
        .toArray();

    return group.map(g => g._id);
}

module.exports = {
    getAllCities,
    getCinemasByCityId,
    getMoviesByCinemaId,
    getMoviesByCityId,
    getMovieSessionByCityId,
    getMovieSessionByCinemaId
}