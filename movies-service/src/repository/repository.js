const database = require('../config/database');
const { ObjectId } = require('mongodb');

async function getAllMovies() {
    const db = await database.connect();
    return db.collection('movies').find().toArray();
}

async function getMovieById(id) {
    const db = await database.connect();
    return db.collection('movies').findOne({ _id: new ObjectId(id) });
}

async function getMoviePremieres() {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const db = await database.connect();
    return db.collection('movies')
        .find({ dataLancamento: { $gte: monthAgo } })
        .toArray();
}

async function addMovie(movie) {
    const db = await database.connect();
    const result = await db.collection('movies').insertOne(movie);
    return result;
}

async function deleteMovie(id) {
    const db = await database.connect();
    return db.collection('movies').deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
    getAllMovies,
    getMovieById,
    getMoviePremieres,
    addMovie,
    deleteMovie
}