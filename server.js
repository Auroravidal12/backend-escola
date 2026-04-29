const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// MongoDB
mongoose.connect("mongodb+srv://auroravidal153_db_user:Aurora18%40@cluster0.efuwjnk.mongodb.net/?appName=Cluster0")
  .then(() => console.log("Mongo conectado!"))
  .catch(err => console.log(err));

// Rota base
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// Modelo
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String
});

// Rotas
app.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// PORT DO RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});