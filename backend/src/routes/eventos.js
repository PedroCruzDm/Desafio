const express = require('express');
const router = express.Router();
const db = require('../config/db');

// CREATE - Cadastrar evento
router.post('/cadastrar', (req, res) => {
  console.log("Dados recebidos para cadastro:", req.body);
  
  const { usuario_id, nome, equipe, status, data, data_inicial, data_final, cor, descricao } = req.body;

  // Verificar se o esquema de dados inclui data_inicial e data_final
  db.query('DESCRIBE eventos', (descErr, descResults) => {
    if (descErr) {
      console.error("Erro ao verificar estrutura da tabela:", descErr);
      return res.status(500).json({ erro: 'Erro ao verificar estrutura da tabela', detalhes: descErr });
    }
    
    // Verificar se as colunas data_inicial e data_final existem
    const columns = descResults.map(col => col.Field);
    
    let sql, params;
    
    if (columns.includes('data_inicial') && columns.includes('data_final')) {
      // Usar data_inicial e data_final se eles existirem
      sql = `
        INSERT INTO eventos (usuario_id, nome, equipe, status, data_inicial, data_final, cor, descricao, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      params = [usuario_id, nome, equipe, status, data_inicial, data_final, cor, descricao];
    } else {
      // Caso contrário, usar apenas data
      sql = `
        INSERT INTO eventos (usuario_id, nome, equipe, status, data, cor, descricao, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      params = [usuario_id, nome, equipe, status, data || data_inicial, cor, descricao];
    }
    
    console.log("SQL preparado:", sql);
    console.log("Parâmetros:", params);

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Erro ao cadastrar evento:", err);
        return res.status(500).json({ erro: 'Erro ao cadastrar evento', detalhes: err });
      }
      console.log("Evento cadastrado com sucesso, ID:", result.insertId);
      res.status(201).json({ mensagem: 'Evento cadastrado com sucesso!', id: result.insertId });
    });
  });
});

// READ - Buscar todos os eventos
router.get('/', (req, res) => {
  console.log("Buscando todos os eventos");
  
  // Verificar a estrutura da tabela para adaptar a consulta
  db.query('DESCRIBE eventos', (descErr, descResults) => {
    if (descErr) {
      console.error("Erro ao descrever tabela eventos:", descErr);
      return res.status(500).json({ erro: 'Erro ao verificar estrutura da tabela', detalhes: descErr });
    }
    
    console.log("Estrutura da tabela eventos:", descResults);
    
    // Mapear os campos da tabela
    const columns = descResults.map(col => col.Field);
    console.log("Colunas disponíveis:", columns);
    
    // Ajustar a consulta com base nos campos existentes
    let orderBy = '';
    if (columns.includes('data_inicial')) {
      orderBy = 'ORDER BY data_inicial DESC';
    } else if (columns.includes('data')) {
      orderBy = 'ORDER BY data DESC';
    } else {
      orderBy = 'ORDER BY id DESC';
    }
    
    const query = `SELECT * FROM eventos ${orderBy}`;
    console.log("Executando consulta:", query);
    
    db.query(query, (err, results) => {
      if (err) {
        console.error("Erro ao buscar eventos:", err);
        return res.status(500).json({ erro: 'Erro ao buscar eventos', detalhes: err });
      }
      console.log(`Retornando ${results.length} eventos`);
      res.status(200).json(results);
    });
  });
});

// UPDATE - Atualizar evento
router.put('/:id', (req, res) => {
  console.log("Dados recebidos para atualização:", req.body);
  console.log("ID do evento:", req.params.id);
  
  const { nome, equipe, status, data_inicial, data_final, cor, descricao } = req.body;

  // Verificar se o esquema de dados inclui data_inicial e data_final
  db.query('DESCRIBE eventos', (descErr, descResults) => {
    if (descErr) {
      console.error("Erro ao verificar estrutura da tabela:", descErr);
      return res.status(500).json({ erro: 'Erro ao verificar estrutura da tabela', detalhes: descErr });
    }
    
    // Verificar se as colunas data_inicial e data_final existem
    const columns = descResults.map(col => col.Field);
    
    let sql, params;
    
    if (columns.includes('data_inicial') && columns.includes('data_final')) {
      // Usar data_inicial e data_final se eles existirem
      sql = `
        UPDATE eventos SET nome=?, equipe=?, status=?, data_inicial=?, data_final=?, cor=?, descricao=?, updated_at=NOW()
        WHERE id=?
      `;
      params = [nome, equipe, status, data_inicial, data_final, cor, descricao, req.params.id];
    } else {
      // Caso contrário, usar apenas data
      sql = `
        UPDATE eventos SET nome=?, equipe=?, status=?, data=?, cor=?, descricao=?, updated_at=NOW()
        WHERE id=?
      `;
      params = [nome, equipe, status, data_inicial, cor, descricao, req.params.id]; // Usar data_inicial como data
    }
    
    console.log("SQL preparado:", sql);
    console.log("Parâmetros:", params);
    
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Erro ao atualizar evento:", err);
        return res.status(500).json({ erro: 'Erro ao atualizar evento', detalhes: err });
      }
      console.log("Evento atualizado com sucesso:", result);
      res.status(200).json({ mensagem: 'Evento atualizado com sucesso' });
    });
  });
});

// DELETE - Deletar evento
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM eventos WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao deletar evento', detalhes: err });
    res.status(200).json({ mensagem: 'Evento deletado com sucesso' });
  });
});

module.exports = router;