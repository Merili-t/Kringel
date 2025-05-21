<?php
// Andmebaasiühendus
$servername = "localhost"; // Kui fail jookseb Greenys, kasuta localhost
$username = "SINU_KASUTAJANIMI"; // nt johndoe
$password = "SINU_PAROOL";
$dbname = "SINU_ANDMEBAASINIMI"; // tavaliselt sama mis kasutajanimi

// Loo ühendus
$conn = new mysqli($servername, $username, $password, $dbname);

// Kontrolli ühendust
if ($conn->connect_error) {
    die("Ühendus ebaõnnestus: " . $conn->connect_error);
}

// Päring
$sql = "SELECT id, name, email FROM students";
$result = $conn->query($sql);

// Andmete kuvamine
if ($result->num_rows > 0) {
    echo "<h2>Õpilased:</h2><ul>";
    while($row = $result->fetch_assoc()) {
        echo "<li>" . htmlspecialchars($row["name"]) . " - " . htmlspecialchars($row["email"]) . "</li>";
    }
    echo "</ul>";
} else {
    echo "Andmed puuduvad.";
}

$conn->close();
?>


