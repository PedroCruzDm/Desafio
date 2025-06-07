// src/auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./config/db');
const dotenv = require('dotenv');
dotenv.config();

const cadastrarUsuario = (dados, callback) => {
  const { nome, email, senha, fotoPerfil, dataNascimento } = dados;

  const salt = bcrypt.genSaltSync(10);
  const senhaHasheada = bcrypt.hashSync(senha, salt);

  const query = 'INSERT INTO usuarios (nome, email, senha, foto_perfil, data_nascimento) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [nome, email, senhaHasheada, fotoPerfil, dataNascimento], callback);
};

const loginUsuario = (email, senha, callback) => {
  const query = 'SELECT * FROM usuarios WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) return callback(err);

    if (results.length === 0) return callback(null, null);

    const usuario = results[0];
    const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);

    if (!senhaCorreta) return callback(null, null);

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    callback(null, {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        fotoPerfil: usuario.foto_perfil,
        dataNascimento: usuario.data_nascimento
      }
    });
  });
};

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) return res.status(403).json({ erro: 'Token inválido' });

    req.usuario = usuario;
    next();
  });
};

module.exports = {
  cadastrarUsuario,
  loginUsuario,
  verificarToken
};