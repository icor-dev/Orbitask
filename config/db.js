const mongoose = require('mongoose');

async function conectarDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Falta MONGODB_URI. Copia .env.example a .env y pega tu cadena de conexión de MongoDB Atlas.');
  }
  await mongoose.connect(uri);
  console.log('✔ Conectado a MongoDB');
}

module.exports = { conectarDB, mongoose };
