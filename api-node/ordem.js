// Aula 22: o await suspende listar, mas não o restante do arquivo.
const pool = require('./db');
async function listar() {
  console.log('A: vou pedir ao banco');
  try {
    const [projetos] = await pool.query('SELECT id FROM projetos');
    console.log('B: o banco respondeu com ' + projetos.length + ' projetos');
  } finally {
    await pool.end();
  }
}
listar().catch(erro => { console.error(erro.message); process.exitCode = 1; });
console.log('C: fim do arquivo');
