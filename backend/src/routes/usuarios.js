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

// Rota para atualizar usuário
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;
  
  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
  }

  let query;
  let params;

  if (senha) {
    // Se a senha foi fornecida, atualiza também a senha
    query = `UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?`;
    params = [nome, email, senha, id];
  } else {
    // Se não, atualiza apenas nome e email
    query = `UPDATE usuarios SET nome = ?, email = ? WHERE id = ?`;
    params = [nome, email, id];
  }

  db.query(query, params, (err, result) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhes: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    
    res.json({ mensagem: 'Usuário atualizado com sucesso' });
  });
});

// Rota para excluir usuário
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  const query = `DELETE FROM usuarios WHERE id = ?`;
  
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao excluir usuário', detalhes: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    
    res.json({ mensagem: 'Usuário excluído com sucesso' });
  });
});

module.exports = router;