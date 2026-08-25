<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../conexao.php';

function responder(int $status, array $dados = []): void
{
    http_response_code($status);
    if ($dados) {
        echo json_encode($dados);
    }
    exit;
}

function lerDados(): array
{
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function validarProjeto(array $dados): array
{
    $nome = trim($dados['nome'] ?? '');
    $descricao = trim($dados['descricao'] ?? '');
    $tecnologias = trim($dados['tecnologias'] ?? '');
    $ano = filter_var($dados['ano'] ?? null, FILTER_VALIDATE_INT);
    $status = $dados['status'] ?? 'rascunho';

    if ($nome === '' || !$ano || $ano < 2000 || $ano > 2100) {
        responder(400, ['erro' => 'Nome e ano válidos são obrigatórios.']);
    }
    if ($descricao === '' || $tecnologias === '') {
        responder(400, ['erro' => 'Descrição e tecnologias são obrigatórias.']);
    }
    if (!in_array($status, ['rascunho', 'publicado'], true)) {
        responder(400, ['erro' => 'Status inválido.']);
    }

    return [
        ':nome' => $nome,
        ':descricao' => $descricao,
        ':tecnologias' => $tecnologias,
        ':link_github' => trim($dados['link_github'] ?? '') ?: null,
        ':ano' => $ano,
        ':status' => $status,
    ];
}

function existeProjeto(PDO $pdo, int $id): bool
{
    $comando = $pdo->prepare('SELECT id FROM projetos WHERE id = :id');
    $comando->execute([':id' => $id]);
    return (bool) $comando->fetch();
}

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    if (isset($_GET['id'])) {
        $comando = $pdo->prepare(
            'SELECT id, nome, descricao, tecnologias, link_github, ano, status FROM projetos WHERE id = :id'
        );
        $comando->execute([':id' => (int) $_GET['id']]);
        $projeto = $comando->fetch();
        if (!$projeto) {
            responder(404, ['erro' => 'Projeto não encontrado.']);
        }
        echo json_encode($projeto);
        exit;
    }

    if (isset($_GET['todos'])) {
        $sql = 'SELECT id, nome, descricao, tecnologias, link_github, ano, status FROM projetos ORDER BY ano DESC, id DESC';
    } else {
        $sql = "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos WHERE status = 'publicado' ORDER BY ano DESC, id";
    }
    echo json_encode($pdo->query($sql)->fetchAll());
    exit;
}

if ($metodo === 'POST') {
    $dados = validarProjeto(lerDados());
    $comando = $pdo->prepare(
        'INSERT INTO projetos (nome, descricao, tecnologias, link_github, ano, status)
         VALUES (:nome, :descricao, :tecnologias, :link_github, :ano, :status)'
    );
    $comando->execute($dados);
    responder(201, ['id' => (int) $pdo->lastInsertId()]);
}

if ($metodo === 'PUT') {
    $id = (int) ($_GET['id'] ?? 0);
    if (!$id) {
        responder(400, ['erro' => 'Informe o id do projeto.']);
    }
    if (!existeProjeto($pdo, $id)) {
        responder(404, ['erro' => 'Projeto não encontrado.']);
    }

    $dados = validarProjeto(lerDados());
    $dados[':id'] = $id;
    $comando = $pdo->prepare(
        'UPDATE projetos
         SET nome = :nome, descricao = :descricao, tecnologias = :tecnologias,
             link_github = :link_github, ano = :ano, status = :status
         WHERE id = :id'
    );
    $comando->execute($dados);
    responder(200, ['mensagem' => 'Projeto atualizado.']);
}

if ($metodo === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if (!$id) {
        responder(400, ['erro' => 'Informe o id do projeto.']);
    }
    if (!existeProjeto($pdo, $id)) {
        responder(404, ['erro' => 'Projeto não encontrado.']);
    }

    $comando = $pdo->prepare('DELETE FROM projetos WHERE id = :id');
    $comando->execute([':id' => $id]);
    responder(204);
}

responder(405, ['erro' => 'Método não permitido.']);
