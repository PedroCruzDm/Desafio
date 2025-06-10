const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const db = require('../config/db');

// Obter todas as equipes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM equipes_json ORDER BY nome');
    
    // Converte membros_lista de JSON string para array real para cada equipe
    const equipes = rows.map(equipe => {
      return {
        ...equipe,
        membros: equipe.membros_lista ? JSON.parse(equipe.membros_lista) : []
      };
    });
    
    res.json(equipes);
  } catch (error) {
    console.error('Erro ao buscar equipes:', error);
    res.status(500).json({ message: 'Erro ao buscar equipes', error: error.message });
  }
});

// Obter uma equipe específica por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM equipes_json WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Equipe não encontrada' });
    }
    
    // Converte membros_lista de JSON string para array
    const equipe = {
      ...rows[0],
      membros: rows[0].membros_lista ? JSON.parse(rows[0].membros_lista) : []
    };
    
    res.json(equipe);
  } catch (error) {
    console.error('Erro ao buscar equipe:', error);
    res.status(500).json({ message: 'Erro ao buscar equipe', error: error.message });
  }
});

// Criar uma nova equipe
router.post('/', async (req, res) => {
  try {
    const { nome, descricao, lider, membros, ativo } = req.body;
    
    // Converte o array de membros para JSON string
    const membros_lista = JSON.stringify(membros || []);
    
    const [result] = await db.promise().query(
      'INSERT INTO equipes_json (nome, descricao, lider, membros_lista, ativo) VALUES (?, ?, ?, ?, ?)',
      [nome, descricao, lider, membros_lista, ativo !== undefined ? ativo : true]
    );
    
    res.status(201).json({
      id: result.insertId,
      nome,
      descricao,
      lider,
      membros,
      ativo: ativo !== undefined ? ativo : true
    });
  } catch (error) {
    console.error('Erro ao criar equipe:', error);
    res.status(500).json({ message: 'Erro ao criar equipe', error: error.message });
  }
});

// Atualizar uma equipe existente
router.put('/:id', async (req, res) => {
  try {
    const { nome, descricao, lider, membros, ativo } = req.body;
    const equipeId = req.params.id;
    
    // Converte o array de membros para JSON string
    const membros_lista = JSON.stringify(membros || []);
    
    await db.promise().query(
      'UPDATE equipes_json SET nome = ?, descricao = ?, lider = ?, membros_lista = ?, ativo = ? WHERE id = ?',
      [nome, descricao, lider, membros_lista, ativo, equipeId]
    );
    
    res.json({
      id: equipeId,
      nome,
      descricao,
      lider,
      membros,
      ativo
    });
  } catch (error) {
    console.error('Erro ao atualizar equipe:', error);
    res.status(500).json({ message: 'Erro ao atualizar equipe', error: error.message });
  }
});

// Excluir uma equipe
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.promise().query(
      'DELETE FROM equipes_json WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Equipe não encontrada' });
    }
    
    res.json({ message: 'Equipe excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir equipe:', error);
    res.status(500).json({ message: 'Erro ao excluir equipe', error: error.message });
  }
});

module.exports = router;