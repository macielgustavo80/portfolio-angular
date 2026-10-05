const express = require('express');
const cors = require('cors');
const pool = require('./db');

// A função também permite testar as rotas sem trocar o banco de produção.
function criarApp(banco = pool) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const campos = 'id, nome, descricao, tecnologias, link_github, ano';
  app.get('/api/projetos', async (req, res) => {
    const todos = req.query.todos === '1';
    const [linhas] = await banco.query(todos
      ? `SELECT ${campos}, status FROM projetos ORDER BY ano DESC, id DESC`
      : `SELECT ${campos} FROM projetos WHERE status = 'publicado' ORDER BY ano DESC, id`);
    res.json(linhas);
  });

  app.get('/api/projetos/:id', async (req, res) => {
    const [linhas] = await banco.execute(
      `SELECT ${campos} FROM projetos WHERE id = ? AND status = 'publicado'`, [req.params.id]);
    if (!linhas.length) return res.status(404).json({ erro: 'Projeto não encontrado.' });
    res.json(linhas[0]);
  });

  const camposTecnologia = 'id, nome, categoria, descricao, ano_criacao';
  app.get('/api/tecnologias', async (req, res) => {
    const [linhas] = await banco.query(
      `SELECT ${camposTecnologia} FROM tecnologias WHERE status = 'ativo' ORDER BY categoria, nome`);
    res.json(linhas);
  });
  app.get('/api/tecnologias/:id', async (req, res) => {
    const [linhas] = await banco.execute(
      `SELECT ${camposTecnologia} FROM tecnologias WHERE id = ? AND status = 'ativo'`, [req.params.id]);
    if (!linhas.length) return res.status(404).json({ erro: 'Tecnologia não encontrada.' });
    res.json(linhas[0]);
  });

  function validar(dados) {
    if (!dados || typeof dados.nome !== 'string' || !dados.nome.trim()) {
      return { erro: 'Informe pelo menos o nome do projeto.' };
    }
    const ano = Number(dados.ano ?? new Date().getFullYear());
    const status = dados.status ?? 'publicado';
    if (!Number.isInteger(ano) || ano < 2000 || ano > 2100) return { erro: 'Ano inválido.' };
    if (!['rascunho', 'publicado', 'arquivado'].includes(status)) return { erro: 'Status inválido.' };
    for (const campo of ['descricao', 'tecnologias', 'link_github']) {
      if (dados[campo] != null && typeof dados[campo] !== 'string') return { erro: 'Campos de texto inválidos.' };
    }
    if (dados.nome.trim().length > 120 || (dados.tecnologias || '').length > 200 || (dados.link_github || '').length > 300) {
      return { erro: 'Texto maior que o limite do campo.' };
    }
    return { valores: [dados.nome.trim(), dados.descricao ?? '', dados.tecnologias ?? '',
      dados.link_github?.trim() || null, ano, status] };
  }

  app.post('/api/projetos', async (req, res) => {
    const dados = validar(req.body);
    if (dados.erro) return res.status(400).json({ erro: dados.erro });
    const [resultado] = await banco.execute(
      'INSERT INTO projetos (nome, descricao, tecnologias, link_github, ano, status) VALUES (?, ?, ?, ?, ?, ?)', dados.valores);
    res.status(201).json({ id: resultado.insertId });
  });
  app.put('/api/projetos/:id', async (req, res) => {
    const dados = validar(req.body);
    if (dados.erro) return res.status(400).json({ erro: dados.erro });
    const [resultado] = await banco.execute(
      'UPDATE projetos SET nome = ?, descricao = ?, tecnologias = ?, link_github = ?, ano = ?, status = ? WHERE id = ?',
      [...dados.valores, req.params.id]);
    if (!resultado.affectedRows) return res.status(404).json({ erro: 'Projeto não encontrado.' });
    res.json({ mensagem: 'Projeto atualizado.' });
  });
  app.delete('/api/projetos/:id', async (req, res) => {
    const [resultado] = await banco.execute('DELETE FROM projetos WHERE id = ?', [req.params.id]);
    if (!resultado.affectedRows) return res.status(404).json({ erro: 'Projeto não encontrado.' });
    res.status(204).end();
  });

  // Mantém o formulário da Aula 18 funcionando na API agora em uso.
  app.post('/api/contato', async (req, res) => {
    const dados = req.body || {};
    const nome = typeof dados.nome === 'string' ? dados.nome.trim() : '';
    const email = typeof dados.email === 'string' ? dados.email.trim() : '';
    const mensagem = typeof dados.mensagem === 'string' ? dados.mensagem.trim() : '';
    const erros = {};
    if (nome.length < 3 || nome.length > 120) erros.nome = 'Informe um nome entre 3 e 120 caracteres.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) erros.email = 'Informe um e-mail válido.';
    if (mensagem.length < 10) erros.mensagem = 'A mensagem precisa ter pelo menos 10 caracteres.';
    if (Object.keys(erros).length) return res.status(400).json({ erros });
    await banco.execute('INSERT INTO contatos (nome, email, mensagem) VALUES (?, ?, ?)', [nome, email, mensagem]);
    res.status(201).json({ mensagem: 'Mensagem enviada com sucesso.' });
  });

  app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));
  // Express 5 encaminha as rejeições dos handlers async para este middleware.
  app.use((erro, req, res, next) => {
    if (erro.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido.' });
    if (erro.type === 'entity.too.large') return res.status(413).json({ erro: 'Corpo muito grande.' });
    console.error('Falha na API:', erro.code || erro.message);
    res.status(500).json({ erro: 'Falha no servidor.' });
  });
  return app;
}

if (require.main === module) {
  const porta = Number(process.env.PORT || 3000);
  criarApp().listen(porta, '0.0.0.0', () => console.log(`API no ar em http://localhost:${porta}`));
}
module.exports = { criarApp };
