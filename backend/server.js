// src/server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const db = require('./src/config/db');
const { cadastrarUsuario, loginUsuario, verificarToken } = require('./src/auth');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());
app.use(express.json());

// Rotas
app.get('/', (req, res) => {
  res.send('🔥 API do desafio rodando!');
});

app.get('/api/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar usuários' });
    }
    res.json(results);
  });
});

const bcrypt = require('bcryptjs');
app.post('/api/usuarios/cadastrar', (req, res) => {
  cadastrarUsuario(req.body, (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar:', err);
      return res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhes: err });
    }

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso',
      id: result.insertId
    });
  });
});

app.post('/api/usuarios/login', (req, res) => {
  const { email, senha } = req.body;

  loginUsuario(email, senha, (err, data) => {
    if (err) return res.status(500).json({ erro: 'Erro ao realizar login', detalhes: err });
    if (!data) return res.status(401).json({ erro: 'Credenciais inválidas' });

    res.status(200).json(data);
  });
});

app.get('/api/usuarios/me', verificarToken, (req, res) => {
  const userId = req.usuario.id;

  const query = 'SELECT id, nome, email, foto_perfil, data_nascimento FROM usuarios WHERE id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar usuário', detalhes: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.status(200).json(results[0]);
  });
});


app.listen(PORT, () => {// Inicia o servidor
  console.log(`Servidor rodando na porta ${PORT}`);
});