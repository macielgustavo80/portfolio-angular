# portfolio-angular

Projeto da matéria de Desenvolvimento Web II (IFPR). Front-end em Angular e
back-end com uma API em PHP + MariaDB.

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

## Back-end (API PHP + MariaDB)

### 1. Pré-requisitos
- PHP 8 ou superior (`php -v`)
- MariaDB (ou MySQL) rodando

### 2. Criar o banco
O script cria o banco `dwii_db`, o usuário `dwii_user`, as tabelas e os dados:

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
