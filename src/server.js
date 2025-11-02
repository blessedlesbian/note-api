import express from 'express';
import bodyParser from 'body-parser';

// Criação do app
const app = express();
app.use(bodyParser.json());

// Importação das rotas
import userRoutes from './routes/users.js';
import noteRoutes from './routes/notes.js';
import tagRoutes from './routes/tags.js';
import authRoutes from './routes/auth.js';

// Registro das rotas principais
app.use('/users', userRoutes);
app.use('/notes', noteRoutes);
app.use('/tags', tagRoutes);
app.use('/auth', authRoutes);

// Rota padrão para erros 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

export default app;
