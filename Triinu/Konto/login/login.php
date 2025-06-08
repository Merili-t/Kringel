<?php
header("Content-Type: application/json");

$servername = "sql7.freesqldatabase.com";
$username = "sql7780418";
$password = "tIyjrs43zs";
$dbname = "sql7780418";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Ühenduse viga']);
    exit;
}

$email = $_POST['email'] ?? '';
$inputPassword = $_POST['password'] ?? '';

if (empty($email) || empty($inputPassword)) {
    echo json_encode(['success' => false, 'error' => 'Täida kõik lahtrid!']);
    exit;
}

$stmt = $conn->prepare("SELECT parool FROM koostaja WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($hashedPassword);
    $stmt->fetch();

    if (password_verify($inputPassword, $hashedPassword)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Vale parool']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Kasutajat ei leitud']);
}

$stmt->close();
$conn->close();
