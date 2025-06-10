const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obter todas as inscrições
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, 
             e.nome as evento_nome, 
             eq.nome as equipe_nome
      FROM inscricoes i
      LEFT JOIN eventos e ON i.evento_id = e.id
      LEFT JOIN equipes eq ON i.equipe_id = eq.id
      ORDER BY i.data_inscricao DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar inscrições:', error);
    res.status(500).json({ message: 'Erro ao buscar inscrições', error: error.message });
  }
});

// Obter contagem total de inscrições
router.get('/count', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) as total FROM inscricoes');
    res.json({ total: rows[0].total });
  } catch (error) {
    console.error('Erro ao contar inscrições:', error);
    res.status(500).json({ message: 'Erro ao contar inscrições', error: error.message });
  }
});

// Obter inscrições de um usuário específico
router.get('/usuario/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, 
             e.nome as evento_nome, 
             eq.nome as equipe_nome
      FROM inscricoes i
      LEFT JOIN eventos e ON i.evento_id = e.id
      LEFT JOIN equipes eq ON i.equipe_id = eq.id
      WHERE i.usuario_id = ?
      ORDER BY i.data_inscricao DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar inscrições do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar inscrições do usuário', error: error.message });
  }
});

// Obter inscrições para um evento específico
router.get('/evento/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, 
             u.nome as usuario_nome,
             u.email as usuario_email
      FROM inscricoes i
      JOIN usuarios u ON i.usuario_id = u.id
      WHERE i.evento_id = ?
      ORDER BY i.data_inscricao DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar inscrições do evento:', error);
    res.status(500).json({ message: 'Erro ao buscar inscrições do evento', error: error.message });
  }
});

// Obter inscrições para uma equipe específica
router.get('/equipe/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, 
             u.nome as usuario_nome,
             u.email as usuario_email
      FROM inscricoes i
      JOIN usuarios u ON i.usuario_id = u.id
      WHERE i.equipe_id = ?
      ORDER BY i.data_inscricao DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar inscrições da equipe:', error);
    res.status(500).json({ message: 'Erro ao buscar inscrições da equipe', error: error.message });
  }
});

// Criar uma nova inscrição
router.post('/', async (req, res) => {
  const { usuario_id, evento_id, equipe_id, tipo, status, data_inscricao } = req.body;
  
  if (!usuario_id) {
    return res.status(400).json({ message: 'ID do usuário é obrigatório' });
  }
  
  if (!tipo || (tipo !== 'evento' && tipo !== 'equipe')) {
    return res.status(400).json({ message: 'Tipo de inscrição inválido. Deve ser "evento" ou "equipe"' });
  }
  
  if (tipo === 'evento' && !evento_id) {
    return res.status(400).json({ message: 'ID do evento é obrigatório para inscrições em eventos' });
  }
  
  if (tipo === 'equipe' && !equipe_id) {
    return res.status(400).json({ message: 'ID da equipe é obrigatório para inscrições em equipes' });
  }
  
  try {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Verificar se o usuário já está inscrito
      const [inscricaoExistente] = await connection.query(
        `SELECT id FROM inscricoes 
         WHERE usuario_id = ? 
         AND ${tipo === 'evento' ? 'evento_id = ?' : 'equipe_id = ?'}`,
        [usuario_id, tipo === 'evento' ? evento_id : equipe_id]
      );
      
      if (inscricaoExistente.length > 0) {
        await connection.rollback();
        return res.status(400).json({ 
          message: `Usuário já inscrito neste ${tipo === 'evento' ? 'evento' : 'equipe'}`
        });
      }
      
      // Inserir a inscrição
      const [result] = await connection.query(
        `INSERT INTO inscricoes 
         (usuario_id, evento_id, equipe_id, tipo, status, data_inscricao) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          usuario_id, 
          tipo === 'evento' ? evento_id : null, 
          tipo === 'equipe' ? equipe_id : null, 
          tipo, 
          status || 'pendente', 
          data_inscricao || new Date().toISOString().split('T')[0]
        ]
      );
      
      await connection.commit();
      
      res.status(201).json({ 
        id: result.insertId,
        message: 'Inscrição realizada com sucesso'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erro ao criar inscrição:', error);
    res.status(500).json({ message: 'Erro ao criar inscrição', error: error.message });
  }
});

// Atualizar status de uma inscrição
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const inscricaoId = req.params.id;
  
  if (!status) {
    return res.status(400).json({ message: 'Status é obrigatório' });
  }
  
  try {
    const [existingInscricao] = await db.query('SELECT id FROM inscricoes WHERE id = ?', [inscricaoId]);
    
    if (existingInscricao.length === 0) {
      return res.status(404).json({ message: 'Inscrição não encontrada' });
    }
    
    await db.query(
      'UPDATE inscricoes SET status = ? WHERE id = ?',
      [status, inscricaoId]
    );
    
    res.json({ 
      message: 'Status da inscrição atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar status da inscrição:', error);
    res.status(500).json({ message: 'Erro ao atualizar status da inscrição', error: error.message });
  }
});

// Excluir uma inscrição
router.delete('/:id', async (req, res) => {
  const inscricaoId = req.params.id;
  
  try {
    const [existingInscricao] = await db.query('SELECT id FROM inscricoes WHERE id = ?', [inscricaoId]);
    
    if (existingInscricao.length === 0) {
      return res.status(404).json({ message: 'Inscrição não encontrada' });
    }
    
    await db.query('DELETE FROM inscricoes WHERE id = ?', [inscricaoId]);
    
    res.json({ 
      message: 'Inscrição excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir inscrição:', error);
    res.status(500).json({ message: 'Erro ao excluir inscrição', error: error.message });
  }
});

module.exports = router;
