export async function login(req, res) {
  console.log('Entrou no login controller!');
  const { email, password } = req.body;
  console.log(' Email:', email, '| Password:', password);

  try {
    const db = await getUsers();
    console.log(' getUsers retornou:', db);
  } catch (err) {
    console.error(' Erro ao acessar getUsers:', err);
  }

  res.status(200).json({ ok: true });
}