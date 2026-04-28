const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/escola")
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

const Aluno = require("./models/Aluno");

// CREATE
app.post("/alunos", async (req, res) => {
  const aluno = await Aluno.create(req.body);
  res.json(aluno);
});

// READ
app.get("/alunos", async (req, res) => {
  const alunos = await Aluno.find();
  res.json(alunos);
});

// UPDATE
app.put("/alunos/:id", async (req, res) => {
  const aluno = await Aluno.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(aluno);
});

// DELETE
app.delete("/alunos/:id", async (req, res) => {
  await Aluno.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});