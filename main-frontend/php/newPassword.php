<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $password = trim($_POST["password"]);
  $confirmPassword = trim($_POST["confirm_password"]);

  if ($password !== $confirmPassword) {
    die("Paroolid ei ühti. Palun mine tagasi ja proovi uuesti.");
  }

  if (!preg_match('/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/~`\\\\|=]).{8,}$/', $password)) {
    die("Parool ei vasta nõuetele.");
  }

  $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

  $servername = "sql7.freesqldatabase.com";
  $username = "sql7780418";
  $dbpassword = "tIyjrs43zs";
  $dbname = "sql7780418";

  $conn = new mysqli($servername, $username, $dbpassword, $dbname);

  if ($conn->connect_error) {
    die("Ühendus ebaõnnestus: " . $conn->connect_error);
  }

  $userId = $_SESSION["user_id"] ?? null;

  if ($userId) {
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    $stmt->bind_param("si", $hashedPassword, $userId);

    if ($stmt->execute()) {
      header("Location: ../php/login.php");
      exit();
    } else {
      echo "Viga parooli uuendamisel: " . $stmt->error;
    }

    $stmt->close();
  } else {
    echo "Kasutaja ID puudub. Palun logi uuesti sisse.";
  }

  $conn->close();
} else {
  echo "Vale päring.";
}
?>
