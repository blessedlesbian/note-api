import { getUsers } from "../services/db.service.js";



export async function login(req, res) {
  console.log('Entrou no login controller!');
  const { email, password } = req.body;
  console.log(' Email:', email, '| Password:', password);

  let user; 
  try {
    const db = await getUsers();
    user = db.find(u => u.email === email && u.password === password);
    if (!user) {
      throw error; 
    }
  } catch (err) {
    return res.status(400).json({ "error": "email ou senha invalidos, nyu" }); 


    console.error(' Erro ao acessar getUsers:', err);
  }

  res.status(200).json({ "id":user.id }); 
} 







