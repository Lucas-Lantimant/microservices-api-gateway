const database = require('../config/database');

async function getUser(email) {
  const db = await database.connect();
  return db.collection('users').findOne({ email });
}


module.exports = {
  getUser
}