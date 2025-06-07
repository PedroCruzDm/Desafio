const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Buscar todos os usuários TESTE
router.get('/', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar usuários' });
    }
    res.json(results);
  });
});

// Rota para cadastrar usuário
router.post('/cadastrar', (req, res) => {
  const { nome, email, senha, fotoPerfil, dataNascimento } = req.body;
  
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos' });
  }

  const query = `
    INSERT INTO usuarios (nome, email, senha, fotoPerfil, dataNascimento)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [nome, email, senha, fotoPerfil, dataNascimento], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhes: err });
    }
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso', id: result.insertId });
  });
});

module.exports = router;