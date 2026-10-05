CREATE DATABASE dwii_db;
-- Crie o usuário separadamente com sua própria senha (veja o README).

USE dwii_db;

CREATE TABLE projetos (
    id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome          VARCHAR(120) NOT NULL,
    descricao     TEXT NOT NULL,
    tecnologias   VARCHAR(200) NOT NULL,
    link_github   VARCHAR(300) NULL DEFAULT NULL,
    ano           YEAR NOT NULL,
    status        ENUM('rascunho','publicado','arquivado') NOT NULL DEFAULT 'rascunho',
    criado_em     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tecnologias (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome        VARCHAR(100) NOT NULL,
    categoria   VARCHAR(50) NOT NULL,
    descricao   TEXT,
    ano_criacao INT,
    status      ENUM('ativo','inativo') NOT NULL DEFAULT 'ativo',
    criado_em   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE contatos (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome        VARCHAR(120) NOT NULL,
    email       VARCHAR(160) NOT NULL,
    mensagem    TEXT NOT NULL,
    criado_em   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SHOW TABLES;

USE dwii_db;

INSERT INTO projetos (nome, descricao, tecnologias, link_github, ano, status) VALUES
('Harpia',
'Plataforma de gestao de pessoas e operacoes internas, com funcionarios, tarefas, solicitacoes, onboarding, offboarding e recursos de IA.',
'Next.js, TypeScript, Tailwind CSS, Prisma e PostgreSQL',
'https://github.com/macielhgustavo/harpia',
2026,
'publicado');

INSERT INTO tecnologias (nome, categoria, descricao, ano_criacao) VALUES
('HTML',       'Frontend',       'Linguagem de marcacao para estrutura de paginas.', 1993),
('CSS',        'Frontend',       'Linguagem de estilos para apresentacao visual.',   1996),
('JavaScript', 'Frontend',       'Linguagem de programacao para o navegador.',       1995),
('PHP',        'Backend',        'Linguagem server-side para web dinamica.',         1994),
('MariaDB',    'Banco de Dados', 'SGBD relacional open-source.',                     2009),
('Git',        'DevOps',         'Sistema de controle de versao distribuido.',       2005);

SELECT id, nome, ano, status FROM projetos;

-- Projetos reais do aluno; o rascunho prova o filtro da API pública.
INSERT INTO projetos (nome, descricao, tecnologias, link_github, ano, status) VALUES
('Portfólio Angular', 'Portfólio da disciplina Desenvolvimento Web II com catálogo, contato e gestão de projetos.',
 'Angular, TypeScript, Node.js, Express, MariaDB', 'https://github.com/macielgustavo80/portfolio-angular', 2026, 'publicado'),
('Desenvolvimento Web II', 'Repositório de atividades da disciplina Desenvolvimento Web II.',
 'HTML, CSS, JavaScript', 'https://github.com/macielgustavo80/2026-DWII', 2026, 'publicado'),
('Próximo projeto', 'Planejamento de um projeto ainda não publicado.', '', NULL, 2026, 'rascunho');
