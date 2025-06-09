const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obter todas as equipes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM equipes ORDER BY nome');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar equipes:', error);
    res.status(500).json({ message: 'Erro ao buscar equipes', error: error.message });
  }
});

// Obter uma equipe específica por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM equipes WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Equipe não encontrada' });
    }
    
    const equipe = rows[0];
    
    // Buscar membros da equipe
    const [membros] = await db.query(
      'SELECT nome FROM membros_equipe WHERE equipe_id = ?',
      [req.params.id]
    );
    
    equipe.membros = membros.map(m => m.nome);
    
    res.json(equipe);
  } catch (error) {
    console.error('Erro ao buscar equipe:', error);
    res.status(500).json({ message: 'Erro ao buscar equipe', error: error.message });
  }
});

// Criar uma nova equipe
router.post('/', async (req, res) => {
  const { nome, descricao, lider, membros, ativo } = req.body;
  
  if (!nome) {
    return res.status(400).json({ message: 'Nome da equipe é obrigatório' });
  }
  
  try {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Inserir a equipe
      const [result] = await connection.query(
        'INSERT INTO equipes (nome, descricao, lider, ativo) VALUES (?, ?, ?, ?)',
        [nome, descricao || null, lider || null, ativo === undefined ? true : ativo]
      );
      
      const equipeId = result.insertId;
      
      // Inserir membros se houver
      if (membros && membros.length > 0) {
        const membroValues = membros.map(membro => [equipeId, membro]);
        await connection.query(
          'INSERT INTO membros_equipe (equipe_id, nome) VALUES ?',
          [membroValues]
        );
      }
      
      await connection.commit();
      
      res.status(201).json({ 
        id: equipeId,
        message: 'Equipe criada com sucesso'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erro ao criar equipe:', error);
    res.status(500).json({ message: 'Erro ao criar equipe', error: error.message });
  }
});

// Atualizar uma equipe existente
router.put('/:id', async (req, res) => {
  const { nome, descricao, lider, membros, ativo } = req.body;
  const equipeId = req.params.id;
  
  if (!nome) {
    return res.status(400).json({ message: 'Nome da equipe é obrigatório' });
  }
  
  try {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Verificar se a equipe existe
      const [existingEquipe] = await connection.query('SELECT id FROM equipes WHERE id = ?', [equipeId]);
      
      if (existingEquipe.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: 'Equipe não encontrada' });
      }
      
      // Atualizar a equipe
      await connection.query(
        'UPDATE equipes SET nome = ?, descricao = ?, lider = ?, ativo = ? WHERE id = ?',
        [nome, descricao || null, lider || null, ativo === undefined ? true : ativo, equipeId]
      );
      
      // Remover membros atuais
      await connection.query('DELETE FROM membros_equipe WHERE equipe_id = ?', [equipeId]);
      
      // Inserir novos membros
      if (membros && membros.length > 0) {
        const membroValues = membros.map(membro => [equipeId, membro]);
        await connection.query(
          'INSERT INTO membros_equipe (equipe_id, nome) VALUES ?',
          [membroValues]
        );
      }
      
      await connection.commit();
      
      res.json({ 
        message: 'Equipe atualizada com sucesso'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erro ao atualizar equipe:', error);
    res.status(500).json({ message: 'Erro ao atualizar equipe', error: error.message });
  }
});

// Excluir uma equipe
router.delete('/:id', async (req, res) => {
  const equipeId = req.params.id;
  
  try {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Verificar se a equipe existe
      const [existingEquipe] = await connection.query('SELECT id FROM equipes WHERE id = ?', [equipeId]);
      
      if (existingEquipe.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: 'Equipe não encontrada' });
      }
      
      // Remover membros
      await connection.query('DELETE FROM membros_equipe WHERE equipe_id = ?', [equipeId]);
      
      // Remover equipe
      await connection.query('DELETE FROM equipes WHERE id = ?', [equipeId]);
      
      await connection.commit();
      
      res.json({ 
        message: 'Equipe excluída com sucesso'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erro ao excluir equipe:', error);
    res.status(500).json({ message: 'Erro ao excluir equipe', error: error.message });
  }
});

module.exports = router;
