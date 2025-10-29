const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/users');
const noteRoutes = require('./routes/notes');
const tagRoutes = require('./routes/tags');

const app = express();
app.use(bodyParser.json());

// Rotas
app.use('/users', userRoutes);
app.use('/notes', noteRoutes);
app.use('/tags', tagRoutes);

// Middleware para rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Exporta o app (para o Jest e outros módulos poderem usar)
module.exports = app;

// Inicializa o servidor somente se este arquivo for executado diretamente
if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}


