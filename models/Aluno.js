const mongoose = require("mongoose");

const AlunoSchema = new mongoose.Schema({
  nome: String,
  idade: Number,
  curso: String
});

module.exports = mongoose.model("Aluno", AlunoSchema);