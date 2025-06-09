<?php
$servername = "sql7.freesqldatabase.com";
$username = "sql7780418";
$password = "tIyjrs43zs";
$dbname = "sql7780418";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Ühendus ebaõnnestus: " . $conn->connect_error);
}

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$confirm_password = $_POST['confirm_password'] ?? '';

if (empty($email) || empty($password) || empty($confirm_password)) {
    die("Kõik väljad peavad olema täidetud.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Vigane emaili aadress.");
}

if ($password !== $confirm_password) {
    die("Paroolid ei kattu.");
}

if (strlen($password) < 8) {
    die("Parool peab olema vähemalt 8 tähemärki.");
}

$check_sql = "SELECT id FROM koostaja WHERE email = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("s", $email);
$check_stmt->execute();
$check_stmt->store_result();
if ($check_stmt->num_rows > 0) {
    die("Selle emailiga konto on juba olemas.");
}
$check_stmt->close();

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$today = date('Y-m-d');

$sql = "INSERT INTO koostaja (email, parool, konto_kp) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $email, $hashedPassword, $today);

if ($stmt->execute()) {
    header("Location: logIn.html");
    exit();
} else {
    echo "Konto loomine ebaõnnestus: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
