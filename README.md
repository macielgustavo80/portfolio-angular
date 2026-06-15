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

Todos respondem em JSON, com `Content-Type: application/json` e CORS liberado.

## Front-end (Angular)

    cd portfolio-angular
    npm install
    ng serve

Acesse http://localhost:4200/.

### Etapas
- Aula 16: Angular Router, páginas Home/Sobre, Angular Material, rota ativa
  com `routerLinkActive`, componentes standalone.
- Aula 17: integração com a API PHP (projetos e tecnologias).

## Tecnologias
Angular, TypeScript, Angular Material, HTML, CSS, PHP, PDO, MariaDB.