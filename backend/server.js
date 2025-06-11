const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Configurações
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
const usuariosRouter = require('./src/routes/usuarios');
const eventosRoutes = require('./src/routes/eventos');
const equipesJsonRoutes = require('./src/routes/equipes_json');

// Teste de rota inicial
app.get('/', (req, res) => {
  res.send('🔥 API do desafio rodando!');
});

// Registrar rotas
app.use('/api/usuarios', usuariosRouter);
app.use('/api/eventos', eventosRoutes);
app.use('/api/equipes_json', equipesJsonRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});