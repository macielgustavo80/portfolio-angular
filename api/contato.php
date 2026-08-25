<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido.']);
    exit;
}

require __DIR__ . '/../conexao.php';

$dados = json_decode(file_get_contents('php://input'), true) ?? [];
$nome = trim($dados['nome'] ?? '');
$email = trim($dados['email'] ?? '');
$mensagem = trim($dados['mensagem'] ?? '');
$erros = [];

if (strlen($nome) < 3) {
    $erros['nome'] = 'Informe um nome com pelo menos 3 letras.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erros['email'] = 'Informe um e-mail válido.';
}
if (strlen($mensagem) < 10) {
    $erros['mensagem'] = 'A mensagem precisa ter pelo menos 10 caracteres.';
}

if ($erros) {
    http_response_code(400);
    echo json_encode(['erros' => $erros]);
    exit;
}

$comando = $pdo->prepare(
    'INSERT INTO contatos (nome, email, mensagem) VALUES (:nome, :email, :mensagem)'
);
$comando->execute([
    ':nome' => $nome,
    ':email' => $email,
    ':mensagem' => $mensagem,
]);

http_response_code(201);
echo json_encode(['mensagem' => 'Mensagem enviada com sucesso.']);
