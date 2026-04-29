const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// 🔥 CORS (CORREÇÃO PRINCIPAL)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// MongoDB
mongoose.connect("mongodb+srv://auroravidal153_db_user:Aurora18%40@cluster0.efuwjnk.mongodb.net/escola?retryWrites=true&w=majority")
  .then(() => console.log("Mongo conectado!"))
  .catch(err => console.log(err));

// MODELO USER
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String
});

// MODELO TURMA
const Turma = mongoose.model("Turma", {
  nome: String,
  sala: String
});

// ROTA BASE
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// USERS CRUD
app.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// REGISTER
app.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  res.json(user);
});

// LOGIN
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

  const ok = await bcrypt.compare(req.body.password, user.password);

  if (!ok) return res.status(400).json({ error: "Senha inválida" });

  const token = jwt.sign({ id: user._id }, "segredo123", { expiresIn: "1h" });

  res.json({ token });
});

// AUTH MIDDLEWARE
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "Sem token" });

  try {
    const decoded = jwt.verify(token, "segredo123");
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

// PERFIL
app.get("/perfil", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
});

// TURMAS CRUD
app.post("/turmas", async (req, res) => {
  const turma = await Turma.create(req.body);
  res.json(turma);
});

app.get("/turmas", async (req, res) => {
  const turmas = await Turma.find();
  res.json(turmas);
});

app.put("/turmas/:id", async (req, res) => {
  const turma = await Turma.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(turma);
});

app.delete("/turmas/:id", async (req, res) => {
  await Turma.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});