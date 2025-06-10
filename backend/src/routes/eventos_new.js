const express = require('express');
const router = express.Router();
const db = require('../config/db');

// CREATE - evento
router.post('/cadastrar', (req, res) => {
  const { usuario_id, nome, equipe, status, data_inicial, data_final, cor, descricao } = req.body;

  console.log("Recebendo evento para cadastrar:", req.body);

  const sql = `
    INSERT INTO eventos (usuario_id, nome, equipe, status, data_inicial, data_final, cor, descricao, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(sql, [usuario_id, nome, equipe, status, data_inicial, data_final, cor, descricao], (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar evento:", err);
      return res.status(500).json({ erro: 'Erro ao cadastrar evento', detalhes: err });
    }
    console.log("Evento cadastrado com sucesso, ID:", result.insertId);
    res.status(201).json({ mensagem: 'Evento cadastrado com sucesso!', id: result.insertId });
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
  console.log("Atualizando evento ID:", req.params.id);
  console.log("Dados recebidos:", req.body);
  
  // Verificar a estrutura da tabela para adaptar a atualização
  db.query('DESCRIBE eventos', (descErr, descResults) => {
    if (descErr) {
      console.error("Erro ao descrever tabela eventos:", descErr);
      return res.status(500).json({ erro: 'Erro ao verificar estrutura da tabela', detalhes: descErr });
    }
    
    // Mapear os campos da tabela
    const columns = descResults.map(col => col.Field);
    console.log("Colunas disponíveis:", columns);
    
    // Extrair os dados do corpo da requisição
    const { nome, equipe, status, data, data_inicial, data_final, cor, descricao } = req.body;
    
    // Construir a query de atualização com base nos campos existentes
    let sql = 'UPDATE eventos SET nome=?, equipe=?, status=?, ';
    let params = [nome, equipe, status];
    
    if (columns.includes('data_inicial') && columns.includes('data_final')) {
      sql += 'data_inicial=?, data_final=?, ';
      params.push(data_inicial, data_final);
    } else if (columns.includes('data')) {
      sql += 'data=?, ';
      params.push(data_inicial || data); // Usar data_inicial se disponível, senão usar data
    }
    
    sql += 'cor=?, descricao=?, updated_at=NOW() WHERE id=?';
    params.push(cor, descricao, req.params.id);
    
    console.log("SQL preparado:", sql);
    console.log("Parâmetros:", params);

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Erro ao atualizar evento:", err);
        return res.status(500).json({ erro: 'Erro ao atualizar evento', detalhes: err });
      }
      console.log("Atualização bem-sucedida:", result);
      res.status(200).json({ mensagem: 'Evento atualizado com sucesso' });
    });
  });
});

// DELETE - Deletar evento
router.delete('/:id', (req, res) => {
  console.log("Deletando evento ID:", req.params.id);
  
  db.query('DELETE FROM eventos WHERE id=?', [req.params.id], (err, result) => {
    if (err) {
      console.error("Erro ao deletar evento:", err);
      return res.status(500).json({ erro: 'Erro ao deletar evento', detalhes: err });
    }
    console.log("Evento deletado com sucesso");
    res.status(200).json({ mensagem: 'Evento deletado com sucesso' });
  });
});

module.exports = router;
