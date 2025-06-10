const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/config/db');
const { cadastrarUsuario, loginUsuario, verificarToken } = require('./src/auth');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Teste de rota inicial
app.get('/', (req, res) => {
  res.send('🔥 API do desafio rodando!');
});

// Listar todos usuários
app.get('/api/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar usuários' });
    res.json(results);
  });
});

// Cadastro
app.post('/api/usuarios/cadastrar', (req, res) => {
  cadastrarUsuario(req.body, (err, result) => {
    if (err) return res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhes: err });

    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso',
      id: result.insertId
    });
  });
});

// Login
app.post('/api/usuarios/login', (req, res) => {
  const { email, senha } = req.body;
  loginUsuario(email, senha, (err, data) => {
    if (err) return res.status(500).json({ erro: 'Erro ao realizar login', detalhes: err });
    if (!data) return res.status(401).json({ erro: 'Credenciais inválidas' });
    res.status(200).json(data);
  });
});

// Perfil autenticado
app.get('/api/usuarios/me', verificarToken, (req, res) => {
  const userId = req.usuario.id;

  db.query(
    'SELECT id, nome, email, foto_perfil, data_nascimento FROM usuarios WHERE id = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ erro: 'Erro ao buscar usuário', detalhes: err });
      if (results.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });
      res.status(200).json(results[0]);
    }
  );
});

// Eventos
const eventosRoutes = require('./src/routes/eventos');
app.use('/api/eventos', eventosRoutes);

// Equipes com armazenamento JSON
const equipesJsonRoutes = require('./src/routes/equipes_json');
app.use('/api/equipes_json', equipesJsonRoutes);

app.post('/api/eventos/cadastrar', (req, res) => {
  const { usuario_id, nome, equipe, status, data, cor, descricao } = req.body;

  const sql = `
    INSERT INTO eventos (usuario_id, nome, equipe, status, data, cor, descricao, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(sql, [usuario_id, nome, equipe, status, data, cor, descricao], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao cadastrar evento', detalhes: err });
    }
    res.status(201).json({ mensagem: 'Evento cadastrado com sucesso!', id: result.insertId });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});