# portfolio-angular

Projeto da matéria de Desenvolvimento Web II (IFPR). Front-end em Angular e
back-end em Node.js + Express + MariaDB (a API PHP permanece como histórico).

Versões: npm 11.9.0, Node v24.14.0, Angular CLI 21.2.13, PHP 8+, MariaDB.

## Estrutura

    .
    ├── api/
    │   ├── projetos.php      # lista projetos publicados (e detalhe via ?id=N)
    │   └── tecnologias.php   # catálogo de tecnologias ativas
    ├── conexao.php           # conexão PDO com o MariaDB (reutilizável)
    ├── sql/
    │   └── setup.sql         # cria o banco, as tabelas e popula os dados
    └── portfolio-angular/    # aplicação Angular (front-end)

## Back-end anterior (API PHP + MariaDB, histórico)

### 1. Pré-requisitos
- PHP 8 ou superior (`php -v`)
- MariaDB (ou MySQL) rodando

### 2. Criar o banco
O script cria o banco `dwii_db`, as tabelas e os dados; crie o usuário separadamente:

    sudo mariadb < sql/setup.sql

(ou, já dentro do cliente: `SOURCE sql/setup.sql;`)

### 3. Subir a API
Na raiz do repositório, usando o servidor embutido do PHP:

    /usr/bin/php -S localhost:8000

### 4. Endpoints
- Lista de projetos:  http://localhost:8000/api/projetos.php
- Detalhe de um projeto:  http://localhost:8000/api/projetos.php?id=3
- Catálogo de tecnologias:  http://localhost:8000/api/tecnologias.php
- Envio de contato: http://localhost:8000/api/contato.php

Todos respondem em JSON, com `Content-Type: application/json` e CORS liberado.

## Front-end (Angular)

    cd portfolio-angular
    npm install
    ng serve

Acesse http://localhost:4200/.

Se a API estiver em outro endereço, altere a constante em
`portfolio-angular/src/app/api-url.ts`.

### Etapas
- Aula 16: Angular Router, páginas Home/Sobre, Angular Material, rota ativa
  com `routerLinkActive`, componentes standalone.
- Aula 17: integração com a API PHP (projetos e tecnologias).

## Tecnologias
Angular, TypeScript, Angular Material, HTML, CSS, PHP, PDO, MariaDB.

## 🎯 Autoavaliação — Aula 17

Conceito pretendido: B

Justificativa:

- Consumo da API (Projetos): `portfolio-angular/src/app/projeto.service.ts` faz o GET dos projetos e `portfolio-angular/src/app/projetos/projetos.ts` recebe a lista. A tela usa `@for` e mostra carregamento, erro e estado vazio em `portfolio-angular/src/app/projetos/projetos.html`.
- Catálogo + botão GitHub: `portfolio-angular/src/app/tecnologia.service.ts` busca as tecnologias e `portfolio-angular/src/app/catalogo/catalogo.html` mostra carregamento, erro e a mensagem quando não há itens. O botão "Ver no GitHub" está em `portfolio-angular/src/app/projetos/projetos.html` com `[href]`.
- Boas práticas: a URL base da API está em `portfolio-angular/src/app/api-url.ts`; as requisições HTTP ficam nos services e os componentes cuidam só dos dados da tela.
- Autoavaliação: esta seção do README.

## 🎯 Autoavaliação — Aula 18

Conceito pretendido: B

- Formulário reativo e erros por campo: `portfolio-angular/src/app/contato/contato.ts`, linhas 18–47, cria o formulário com `Validators`; `portfolio-angular/src/app/contato/contato.html`, linhas 7–38, mostra as mensagens só depois de o campo ser tocado.
- POST e estados de envio: `portfolio-angular/src/app/contato.service.ts`, linhas 13–18, faz o POST; em `contato.ts`, linhas 37–46, o `subscribe` trata sucesso com `reset()` e erro sem deixar o botão travado.
- Endpoint: `api/contato.php`, linhas 20–52, lê o JSON, valida novamente no servidor e grava com `prepare` e `execute`, respondendo 201 ou 400.
- Feedback na tela: `contato.html`, linhas 26–38, mostra o envio, a confirmação e a mensagem de erro em texto.

## 🎯 Autoavaliação — Aula 19

Conceito pretendido: B

- API por verbo e status: `api/projetos.php`, linhas 65–133, trata GET, POST, PUT, DELETE e OPTIONS. O parâmetro `?todos=1` é usado apenas pela gestão para incluir rascunhos.
- Gestão pelo service: `portfolio-angular/src/app/gestao/gestao.ts`, linhas 36–117, só chama `ProjetoService`; as URLs e o `HttpClient` ficam em `portfolio-angular/src/app/projeto.service.ts`, linhas 25–45.
- Formulário e atualização: `portfolio-angular/src/app/gestao/gestao.html`, linhas 7–69, tem validação de nome e ano, escolha entre rascunho e publicado e mostra o status em texto. Em `gestao.ts`, linhas 51–117, a lista é carregada de novo depois de salvar e o formulário volta para adicionar.
- Exclusão: `gestao.ts`, linhas 89–102, pede confirmação com o nome e remove o item da lista assim que a API confirma a exclusão.

## Aula 19: como a API atende quatro ações

O endereço continua o mesmo porque o servidor também olha o método da requisição. GET consulta dados; POST cria; PUT altera o projeto indicado pelo `id`; DELETE remove esse mesmo projeto. Assim, a rota fica única e cada ação continua explícita.

## Aula 19: testes com curl

Com a API e o banco locais ligados, os retornos conferidos foram:

    HTTP/1.1 400 Bad Request
    {"erro":"Nome e ano válidos são obrigatórios."}

    HTTP/1.1 400 Bad Request
    {"erro":"Informe o id do projeto."}

    HTTP/1.1 404 Not Found
    {"erro":"Projeto não encontrado."}

    HTTP/1.1 405 Method Not Allowed
    {"erro":"Método não permitido."}

Também foi conferido um POST com status 201, um PUT com status 200, um DELETE com status 204 e o OPTIONS com status 204 e `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`.

## Aula 19: atualização da lista

Depois de salvar, a tela pede a lista novamente à API para trazer os dados como ficaram no banco. Ao excluir, ela remove o item do array local, porque já sabe exatamente qual linha saiu. A primeira opção faz uma viagem a mais à rede; a segunda é mais rápida, mas pode deixar a tela desatualizada se outra alteração acontecer fora dela.

## Aula 19: uma operação na aba Network

Ao adicionar um projeto, a requisição é POST e a API responde 201 com `Content-Type: application/json`. Ao apagar, a requisição é DELETE e a resposta é 204 porque não há conteúdo para devolver depois de remover o registro.

## Aula 19: clique duplo ao salvar

Enquanto o projeto está sendo salvo, `salvando` fica como `true` e o botão é bloqueado. Isso evita que dois cliques rápidos enviem dois POSTs e criem o mesmo projeto duas vezes.

## API em Node — Aulas 21, 22 e 23

A API em uso pelo Angular é **Node.js na porta 3000**. A API PHP não precisa
estar rodando. Projetos, catálogo, gestão e contato usam a nova API.

### Como rodar

Na raiz do repositório, prepare o banco:

```bash
sudo service mariadb start
# Somente no primeiro uso, com banco e usuário ainda inexistentes:
sudo mariadb < sql/setup.sql
cd api-node
npm ci
read -rsp "Senha do banco: " DB_PASSWORD; echo
export DB_PASSWORD
npm start
```

Em outro terminal, na raiz:

```bash
cd portfolio-angular
npm install
npm start -- --host 0.0.0.0
```

Abra `http://localhost:4200`. No Codespaces, torne a porta **3000 pública**
no painel PORTS e abra a URL encaminhada da porta 4200. `api-url.ts` deduz a
URL da porta 3000 a partir do nome do Codespace. Para outro servidor, ajuste
essa constante. O Node escuta em `0.0.0.0` para o encaminhamento funcionar.

`sql/setup.sql` é para instalação inicial, não uma migração de banco existente.
Ele preserva Harpia e acrescenta Portfólio Angular e Desenvolvimento Web II,
com links reais, além de um rascunho para conferir o filtro. Portanto, neste
banco são **três projetos publicados**, não os cinco exemplos do professor.
Se já existe `dwii_db`, mantenha seus dados; não execute o setup novamente.
Os INSERTs novos no final do arquivo podem ser executados uma única vez,
se desejar acrescentar esses projetos à instalação existente.

### Configuração do banco

Em uma instalação nova, crie o usuário no console `sudo mariadb`,
substituindo o marcador por uma senha escolhida por você:

```sql
CREATE USER 'dwii_user'@'localhost' IDENTIFIED BY '<sua-senha>';
GRANT ALL PRIVILEGES ON dwii_db.* TO 'dwii_user'@'localhost';
FLUSH PRIVILEGES;
```

Se o usuário já existe no Codespace, use a senha atual no prompt antes de
`npm start`. A senha da API Node não fica no código nem no Git. A API PHP
histórica conserva a configuração antiga; ela não é usada pelo Angular.


`api-node/db.js` usa `mysql2/promise`, pool de dez conexões, `dwii_db`,
`dwii_user`, senha fornecida por `DB_PASSWORD` e socket `/run/mysqld/mysqld.sock`,
como no ambiente das aulas. É possível substituir os valores por
`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SOCKET`; para TCP, informe `DB_HOST`
e opcionalmente `DB_PORT`. `PORT` altera a porta HTTP.

### Contrato e rotas

| Método | Caminho | Resultado |
| --- | --- | --- |
| GET | `/api/projetos` | 200, publicados com os seis campos originais |
| GET | `/api/projetos/:id` | 200, objeto publicado; 404 se ausente ou rascunho |
| GET | `/api/projetos?todos=1` | 200, lista de gestão, com status e rascunhos |
| GET | `/api/tecnologias` | 200, tecnologias ativas |
| GET | `/api/tecnologias/:id` | 200, tecnologia ativa; 404 se ausente |
| POST | `/api/projetos` | 201 com id; 400 para dados inválidos |
| PUT | `/api/projetos/:id` | 200; 404 para id inexistente |
| DELETE | `/api/projetos/:id` | 204 sem corpo; 404 na segunda exclusão |
| OPTIONS | rotas da API | 204, cabeçalhos de CORS para o pré-voo |
| POST | `/api/contato` | 201, contato gravado; 400 com erros por campo |

O POST aceita nome e ano, como no curl das aulas; descrição e tecnologias
omitidas viram texto vazio, link ausente vira `null` e o status padrão é
`publicado`. A gestão pode enviar `rascunho` ou `publicado`, inclusive no PUT.
O formulário Angular conserva sua validação de descrição e tecnologias.
SQL com `?` separa os valores do comando. Falhas do banco retornam 500 em JSON,
sem stack nem dados internos; a API permanece atendendo e o pool se recupera.
JSON malformado recebe 400. DELETE sem id recebe 404 porque essa rota não existe.

### O que foi aprendido em cada aula

- **21:** Node executa JavaScript fora do navegador; Express cria o servidor;
  npm instala dependências locais e o lockfile fixa a instalação. O Angular
  depende de endereço, verbo e formato JSON, por isso a mudança de linguagem
  no servidor preserva os cards. `cors()` libera a chamada de outra origem.
- **22:** `await` espera a promessa da consulta; o array de linhas é o primeiro
  item devolvido por mysql2. Sem await, a promessa pendente não é a lista.
  `node ordem.js` demonstra A, C, B: enquanto o banco responde, o restante do
  arquivo continua. O pool reaproveita conexões e cria novas quando necessário.
- **23:** `express.json()` transforma o corpo JSON em `req.body` antes das rotas.
  `insertId` identifica o novo registro; `affectedRows` permite detectar id
  inexistente em UPDATE e DELETE. O PUT repetido com os mesmos valores ainda
  retorna 200. OPTIONS é o pré-voo enviado pelo navegador para permitir a escrita.

### Verificação executada em 05/10/2026

- Build de produção do Angular concluído.
- Angular: cinco arquivos de teste, seis testes aprovados. O teste do App foi
  atualizado para fornecer o Router e conferir a toolbar real do portfólio.
- `cd api-node && npm test`: teste de contrato HTTP aprovado, com banco simulado,
  cobrindo CRUD, filtro, CORS, validação, contato e recuperação após erro.
- MariaDB **10.11.14 real**, banco criado a partir de `sql/setup.sql`: consultas,
  POST 201/400, PUT 200/404 (incluindo repetição sem mudança), DELETE 204/404,
  rascunho, publicação, catálogo, contato e OPTIONS conferidos com curl.
- Banco parado de propósito: GET e POST responderam 500 em JSON. Após religar
  o MariaDB, GET voltou a 200 **sem reiniciar o Node**.

O MariaDB usado na verificação foi isolado via TCP na porta 3307, com
`DB_HOST=127.0.0.1 DB_PORT=3307`; o padrão do Codespace continua sendo o socket.
Os registros de teste foram excluídos pelo próprio CRUD. As respostas reais,
incluindo os curls das cinco operações exigidas, estão abaixo.

### Autoavaliação por arquivo

- `api-node/server.js`: servidor, middleware, contrato, leitura e CRUD com status;
  rotas de catálogo e contato; tratamento de erros JSON.
- `api-node/db.js`: pool mysql2/promise, mesmo banco da API PHP.
- `api-node/package.json` e `package-lock.json`: dependências e scripts reproduzíveis.
- `api-node/ordem.js`: exercício de execução assíncrona da Aula 22.
- `sql/setup.sql`: projetos reais e um rascunho para verificar a filtragem pública.
- `portfolio-angular/src/app/api-url.ts` e services: integração com Node,
  sem `.php`, e PUT/DELETE usando o id no caminho.
- `.gitignore`: dependências e configurações locais fora do Git.
- `README.md`: como rodar, conceitos, rotas e evidência das respostas.

Os requisitos de código dos níveis A das aulas 21–23 estão implementados.
O ciclo HTTP foi verificado com banco real e a compilação Angular passou;
a interação da gestão na aba Network do navegador não foi inspecionada nesta
execução. A abertura da porta pública e o teste no celular dependem do seu
Codespace. Login e JWT pertencem à Aula 24, que não está nos materiais enviados.

### Curls e respostas reais

```bash
curl -sS -i -X GET http://localhost:3000/api/projetos
```

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 834
ETag: W/"342-z5XCF9vc7AHdzXPFCTPve03hK2c"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":1,"nome":"Harpia","descricao":"Plataforma de gestao de pessoas e operacoes internas, com funcionarios, tarefas, solicitacoes, onboarding, offboarding e recursos de IA.","tecnologias":"Next.js, TypeScript, Tailwind CSS, Prisma e PostgreSQL","link_github":"https://github.com/macielhgustavo/harpia","ano":2026},{"id":2,"nome":"Portfólio Angular","descricao":"Portfólio da disciplina Desenvolvimento Web II com catálogo, contato e gestão de projetos.","tecnologias":"Angular, TypeScript, Node.js, Express, MariaDB","link_github":"https://github.com/macielgustavo80/portfolio-angular","ano":2026},{"id":3,"nome":"Desenvolvimento Web II","descricao":"Repositório de atividades da disciplina Desenvolvimento Web II.","tecnologias":"HTML, CSS, JavaScript","link_github":"https://github.com/macielgustavo80/2026-DWII","ano":2026}]
```

```bash
curl -sS -i -X GET http://localhost:3000/api/projetos/1
```

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 314
ETag: W/"13a-fRADFcEUVqJ6EjXxGkUtvf6uRkk"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1,"nome":"Harpia","descricao":"Plataforma de gestao de pessoas e operacoes internas, com funcionarios, tarefas, solicitacoes, onboarding, offboarding e recursos de IA.","tecnologias":"Next.js, TypeScript, Tailwind CSS, Prisma e PostgreSQL","link_github":"https://github.com/macielhgustavo/harpia","ano":2026}
```

```bash
curl -sS -i -X GET http://localhost:3000/api/projetos/4
```

```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 35
ETag: W/"23-NfHgPUQh9VORHsyYyMU0vPiaRAA"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"erro":"Projeto não encontrado."}
```

```bash
curl -sS -i -X GET http://localhost:3000/api/tecnologias
```

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 736
ETag: W/"2e0-YsLaqBHneUGffU2LLDy0uiQELLo"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":4,"nome":"PHP","categoria":"Backend","descricao":"Linguagem server-side para web dinamica.","ano_criacao":1994},{"id":5,"nome":"MariaDB","categoria":"Banco de Dados","descricao":"SGBD relacional open-source.","ano_criacao":2009},{"id":6,"nome":"Git","categoria":"DevOps","descricao":"Sistema de controle de versao distribuido.","ano_criacao":2005},{"id":2,"nome":"CSS","categoria":"Frontend","descricao":"Linguagem de estilos para apresentacao visual.","ano_criacao":1996},{"id":1,"nome":"HTML","categoria":"Frontend","descricao":"Linguagem de marcacao para estrutura de paginas.","ano_criacao":1993},{"id":3,"nome":"JavaScript","categoria":"Frontend","descricao":"Linguagem de programacao para o navegador.","ano_criacao":1995}]
```

```bash
curl -sS -i -X GET http://localhost:3000/api/tecnologias/1
```

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 127
ETag: W/"7f-DxYwQ63M9sxxOJIkHtkZxajIbgA"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1,"nome":"HTML","categoria":"Frontend","descricao":"Linguagem de marcacao para estrutura de paginas.","ano_criacao":1993}
```

```bash
curl -sS -i -X GET http://localhost:3000/api/tecnologias/999
```

```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 38
ETag: W/"26-F9J3YTspIMeJmBDhmkRDI6QUYZk"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"erro":"Tecnologia não encontrada."}
```

```bash
curl -sS -i -X POST http://localhost:3000/api/projetos -H 'Content-Type: application/json' -d '{"nome": "Projeto de teste", "ano": 2026}'
```

```http
HTTP/1.1 201 Created
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 8
ETag: W/"8-4U72Xq+/t/P6Xscj7oQblSpGEbo"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":5}
```

```bash
curl -sS -i -X GET http://localhost:3000/api/projetos/5
```

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 96
ETag: W/"60-Qvp3gszUrD11vVPuxMBv6BVmR/k"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":5,"nome":"Projeto de teste","descricao":"","tecnologias":"","link_github":null,"ano":2026}
```

```bash
curl -sS -i -X POST http://localhost:3000/api/projetos -H 'Content-Type: application/json' -d '{"ano": 2026}'
```

```http
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 48
ETag: W/"30-6qQNDbPx1Z+bMjlVfpOmb4Kjvlk"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"erro":"Informe pelo menos o nome do projeto."}
```

```bash
curl -sS -i -X PUT http://localhost:3000/api/projetos/5 -H 'Content-Type: application/json' -d '{"nome": "Projeto de teste (editado)", "ano": 2026}'
```

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 34
ETag: W/"22-WlwvzjIGcwA3nQKMcbrfWqZ2nUU"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"mensagem":"Projeto atualizado."}
```

```bash
curl -sS -i -X PUT http://localhost:3000/api/projetos/5 -H 'Content-Type: application/json' -d '{"nome": "Projeto de teste (editado)", "ano": 2026}'
```

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 34
ETag: W/"22-WlwvzjIGcwA3nQKMcbrfWqZ2nUU"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"mensagem":"Projeto atualizado."}
```

```bash
curl -sS -i -X PUT http://localhost:3000/api/projetos/999 -H 'Content-Type: application/json' -d '{"nome": "Projeto de teste (editado)", "ano": 2026}'
```

```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 35
ETag: W/"23-NfHgPUQh9VORHsyYyMU0vPiaRAA"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"erro":"Projeto não encontrado."}
```

```bash
curl -sS -i -X OPTIONS http://localhost:3000/api/projetos/5 -H 'Origin: http://localhost:4200' -H 'Access-Control-Request-Method: PUT' -H 'Access-Control-Request-Headers: content-type'
```

```http
HTTP/1.1 204 No Content
X-Powered-By: Express
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
Vary: Access-Control-Request-Headers
Access-Control-Allow-Headers: content-type
Content-Length: 0
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

```bash
curl -sS -i -X DELETE http://localhost:3000/api/projetos/5
```

```http
HTTP/1.1 204 No Content
X-Powered-By: Express
Access-Control-Allow-Origin: *
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

```bash
curl -sS -i -X DELETE http://localhost:3000/api/projetos/5
```

```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 35
ETag: W/"23-NfHgPUQh9VORHsyYyMU0vPiaRAA"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"erro":"Projeto não encontrado."}
```

```bash
curl -sS -i -X DELETE http://localhost:3000/api/projetos
```

```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 32
ETag: W/"20-AAHZ9THTELImc9gwfV3j/c0rvFI"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"erro":"Rota não encontrada."}
```

```bash
curl -sS -i -X POST http://localhost:3000/api/projetos -H 'Content-Type: application/json' -d '{"nome": "Rascunho de teste", "ano": 2026, "status": "rascunho"}'
```

```http
HTTP/1.1 201 Created
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 8
ETag: W/"8-v0WR02X6LTiYi/5IvepyWXxki5M"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":6}
```

```bash
curl -sS -i -X GET http://localhost:3000/api/projetos/6
```

```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 35
ETag: W/"23-NfHgPUQh9VORHsyYyMU0vPiaRAA"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"erro":"Projeto não encontrado."}
```

```bash
curl -sS -i -X GET 'http://localhost:3000/api/projetos?todos=1'
```

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 1180
ETag: W/"49c-fX1kBOLwxBHs2m/qsQePmsYoGFw"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":6,"nome":"Rascunho de teste","descricao":"","tecnologias":"","link_github":null,"ano":2026,"status":"rascunho"},{"id":4,"nome":"Próximo projeto","descricao":"Planejamento de um projeto ainda não publicado.","tecnologias":"","link_github":null,"ano":2026,"status":"rascunho"},{"id":3,"nome":"Desenvolvimento Web II","descricao":"Repositório de atividades da disciplina Desenvolvimento Web II.","tecnologias":"HTML, CSS, JavaScript","link_github":"https://github.com/macielgustavo80/2026-DWII","ano":2026,"status":"publicado"},{"id":2,"nome":"Portfólio Angular","descricao":"Portfólio da disciplina Desenvolvimento Web II com catálogo, contato e gestão de projetos.","tecnologias":"Angular, TypeScript, Node.js, Express, MariaDB","link_github":"https://github.com/macielgustavo80/portfolio-angular","ano":2026,"status":"publicado"},{"id":1,"nome":"Harpia","descricao":"Plataforma de gestao de pessoas e operacoes internas, com funcionarios, tarefas, solicitacoes, onboarding, offboarding e recursos de IA.","tecnologias":"Next.js, TypeScript, Tailwind CSS, Prisma e PostgreSQL","link_github":"https://github.com/macielhgustavo/harpia","ano":2026,"status":"publicado"}]
```

```bash
curl -sS -i -X PUT http://localhost:3000/api/projetos/6 -H 'Content-Type: application/json' -d '{"nome": "Agora publicado", "ano": 2026, "status": "publicado"}'
```

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 34
ETag: W/"22-WlwvzjIGcwA3nQKMcbrfWqZ2nUU"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"mensagem":"Projeto atualizado."}
```

```bash
curl -sS -i -X GET http://localhost:3000/api/projetos/6
```

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 95
ETag: W/"5f-M8LEaq2HODOba2atgHSPGnCg8MI"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":6,"nome":"Agora publicado","descricao":"","tecnologias":"","link_github":null,"ano":2026}
```

```bash
curl -sS -i -X DELETE http://localhost:3000/api/projetos/6
```

```http
HTTP/1.1 204 No Content
X-Powered-By: Express
Access-Control-Allow-Origin: *
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

```bash
curl -sS -i -X POST http://localhost:3000/api/contato -H 'Content-Type: application/json' -d '{"nome": "Aluno", "email": "aluno@example.com", "mensagem": "Teste de contato Node."}'
```

```http
HTTP/1.1 201 Created
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 44
ETag: W/"2c-ZUH1nDDuTAE5dhUHJ/L15D0o5xE"
Date: Mon, 05 Oct 2026 19:36:08 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"mensagem":"Mensagem enviada com sucesso."}
```

```bash
curl -sS -i -X GET http://localhost:3000/api/projetos
```

```http
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 29
ETag: W/"1d-ck0c+opfaBRY0hP+3tFzq4Un0W8"
Date: Mon, 05 Oct 2026 19:36:09 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"erro":"Falha no servidor."}
```

```bash
curl -sS -i -X POST http://localhost:3000/api/projetos -H 'Content-Type: application/json' -d '{"nome": "Banco fora", "ano": 2026}'
```

```http
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 29
ETag: W/"1d-ck0c+opfaBRY0hP+3tFzq4Un0W8"
Date: Mon, 05 Oct 2026 19:36:09 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"erro":"Falha no servidor."}
```

```bash
curl -sS -i -X GET http://localhost:3000/api/projetos
```

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 834
ETag: W/"342-z5XCF9vc7AHdzXPFCTPve03hK2c"
Date: Mon, 05 Oct 2026 19:36:09 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":1,"nome":"Harpia","descricao":"Plataforma de gestao de pessoas e operacoes internas, com funcionarios, tarefas, solicitacoes, onboarding, offboarding e recursos de IA.","tecnologias":"Next.js, TypeScript, Tailwind CSS, Prisma e PostgreSQL","link_github":"https://github.com/macielhgustavo/harpia","ano":2026},{"id":2,"nome":"Portfólio Angular","descricao":"Portfólio da disciplina Desenvolvimento Web II com catálogo, contato e gestão de projetos.","tecnologias":"Angular, TypeScript, Node.js, Express, MariaDB","link_github":"https://github.com/macielgustavo80/portfolio-angular","ano":2026},{"id":3,"nome":"Desenvolvimento Web II","descricao":"Repositório de atividades da disciplina Desenvolvimento Web II.","tecnologias":"HTML, CSS, JavaScript","link_github":"https://github.com/macielgustavo80/2026-DWII","ano":2026}]
```
