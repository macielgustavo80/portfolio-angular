const { test } = require('node:test');
const assert = require('node:assert/strict');
const { criarApp } = require('./server');

// Testa o contrato HTTP e a falha do banco sem depender de um MariaDB instalado.
test('contrato HTTP, validação, CORS e isolamento de erros', async (t) => {
  const projetos = new Map();
  let proximoId = 1;
  let falhar = false;
  const banco = {
    async query(sql) {
      if (falhar) throw new Error('detalhe interno do banco');
      if (sql.includes('FROM tecnologias')) return [[{ id: 1, nome: 'Node.js' }]];
      return [[...projetos.values()].filter(p => !sql.includes("status = 'publicado'") || p.status === 'publicado')];
    },
    async execute(sql, valores) {
      if (falhar) throw new Error('detalhe interno do banco');
      if (sql.startsWith('INSERT INTO contatos')) return [{ insertId: 1 }];
      if (sql.startsWith('INSERT')) {
        const id = proximoId++;
        projetos.set(id, Object.fromEntries(['nome', 'descricao', 'tecnologias', 'link_github', 'ano', 'status'].map((k, i) => [k, valores[i]]).concat([['id', id]])));
        return [{ insertId: id }];
      }
      const id = Number(valores.at(-1));
      const projeto = projetos.get(id);
      if (sql.startsWith('UPDATE')) {
        if (projeto) ['nome', 'descricao', 'tecnologias', 'link_github', 'ano', 'status'].forEach((k, i) => projeto[k] = valores[i]);
        return [{ affectedRows: projeto ? 1 : 0 }];
      }
      if (sql.startsWith('DELETE')) return [{ affectedRows: projetos.delete(id) ? 1 : 0 }];
      return [[...(projeto && projeto.status === 'publicado' ? [projeto] : [])]];
    }
  };
  const servidor = criarApp(banco).listen(0, '127.0.0.1');
  await new Promise(resolve => servidor.once('listening', resolve));
  t.after(() => new Promise(resolve => servidor.close(resolve)));
  const base = `http://127.0.0.1:${servidor.address().port}/api`;
  const pedir = (rota, method = 'GET', dados) => fetch(base + rota, { method,
    headers: { 'Content-Type': 'application/json' }, body: dados === undefined ? undefined : JSON.stringify(dados) });
  let r = await pedir('/projetos', 'POST', { nome: 'Teste', ano: 2026 });
  assert.equal(r.status, 201);
  const { id } = await r.json();
  r = await pedir(`/projetos/${id}`);
  assert.equal(r.status, 200);
  assert.equal((await r.json()).link_github, null);
  assert.equal(r.headers.get('access-control-allow-origin'), '*');
  assert.match(r.headers.get('content-type'), /application\/json/);
  assert.equal((await pedir('/projetos', 'POST', { ano: 2026 })).status, 400);
  assert.equal((await pedir('/projetos', 'POST', { nome: 'Inválido', ano: 'texto' })).status, 400);
  assert.equal((await pedir(`/projetos/${id}`, 'PUT', { nome: 'Editado', ano: 2026 })).status, 200);
  assert.equal((await pedir(`/projetos/${id}`, 'PUT', { nome: 'Editado', ano: 2026 })).status, 200);
  assert.equal((await pedir('/projetos/999', 'PUT', { nome: 'Ausente', ano: 2026 })).status, 404);
  assert.equal((await pedir('/projetos', 'POST', { nome: 'Rascunho', ano: 2026, status: 'rascunho' })).status, 201);
  assert.equal((await (await pedir('/projetos')).json()).length, 1);
  assert.equal((await (await pedir('/projetos?todos=1')).json()).length, 2);
  assert.equal((await pedir('/projetos/2')).status, 404);
  r = await fetch(base + '/projetos/1', { method: 'OPTIONS', headers: { Origin: 'http://localhost:4200', 'Access-Control-Request-Method': 'PUT', 'Access-Control-Request-Headers': 'content-type' } });
  assert.equal(r.status, 204);
  assert.match(r.headers.get('access-control-allow-methods'), /PUT/);
  assert.equal((await pedir(`/projetos/${id}`, 'DELETE')).status, 204);
  assert.equal((await pedir(`/projetos/${id}`, 'DELETE')).status, 404);
  assert.equal((await pedir('/projetos', 'DELETE')).status, 404);
  assert.equal((await pedir('/tecnologias')).status, 200);
  r = await fetch(base + '/projetos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal(r.status, 400);
  assert.equal((await pedir('/contato', 'POST', { nome: 'Aluno', email: 'aluno@example.com', mensagem: 'Teste de contato.' })).status, 201);
  assert.equal((await pedir('/contato', 'POST', {})).status, 400);
  falhar = true;
  r = await pedir('/projetos');
  assert.equal(r.status, 500);
  assert.deepEqual(await r.json(), { erro: 'Falha no servidor.' });
  assert.equal((await pedir('/projetos', 'POST', { nome: 'Falha', ano: 2026 })).status, 500);
  falhar = false;
  assert.equal((await pedir('/projetos')).status, 200);
});
