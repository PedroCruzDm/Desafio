const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  const { nome, email, senha, fotoPerfil: foto_perfil, dataNascimento: data_nascimento } = req.body;
  
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos' });
  }

  const salt = bcrypt.genSaltSync(10);
  const senhaHasheada = bcrypt.hashSync(senha, salt);

  const query = `
    INSERT INTO usuarios (nome, email, senha, foto_perfil, data_nascimento)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [nome, email, senhaHasheada, foto_perfil, data_nascimento], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar usuário:', err);
      return res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhes: err.message });
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

// Rota para login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  const query = 'SELECT * FROM usuarios WHERE email = ?';
  
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ erro: 'Erro ao realizar login' });
    }

    if (results.length === 0) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const usuario = results[0];
    const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        foto_perfil: usuario.foto_perfil
      }
    });
  });
});

module.exports = router;