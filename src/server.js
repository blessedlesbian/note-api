const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

//app.use('/users', userRoutes);
//app.use('/notes', noteRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

module.exports = app; 


