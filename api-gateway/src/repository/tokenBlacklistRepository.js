const database = require('../config/database');

async function addTokenToBlacklist(token) {
  const db = await database.connect();
  return db.collection('blacklist').insertOne({ _id: token, date: new Date() });
}

async function isTokenBlacklisted(token) {
  const db = await database.connect();
  const qtd = await db.collection('blacklist').countDocuments({ _id: token }) > 0;
  return qtd > 0;
}

module.exports = {
  addTokenToBlacklist,
  isTokenBlacklisted
}