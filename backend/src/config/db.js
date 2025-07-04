const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

let db;

if (process.env.DATABASE_URL) {
  // Conexão usando DATABASE_URL
  db = mysql.createConnection(process.env.DATABASE_URL);
} else {
  // Conexão usando variáveis separadas
  db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'desafiodb'
  });
}

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.message);
  } else {
    console.log('Conectado ao MySQL!');
  }
});

module.exports = db;