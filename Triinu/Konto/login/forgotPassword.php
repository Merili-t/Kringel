<?php
header("Content-Type: application/json");

$servername = "sql7.freesqldatabase.com";
$username = "sql7780418";
$password = "tIyjrs43zs";
$dbname = "sql7780418";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Andmebaasi ühendus ebaõnnestus']);
    exit;
}

$email = $_POST['email'] ?? '';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Vigane emaili aadress']);
    exit;
}

$stmt = $conn->prepare("SELECT id FROM koostaja WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // Simulate sending email
    // In real usage: generate token, store in DB, and email a reset link
    echo json_encode(['success' => true, 'message' => 'Parooli lähtestamise link saadeti emailile.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Sellise emailiga kontot ei leitud.']);
}

$stmt->close();
$conn->close();
