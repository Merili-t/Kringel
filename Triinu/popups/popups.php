
<?php
$mysqli = new mysqli("localhost", "SINU_KASUTAJANIMI", "SINU_PAROOL", "SINU_ANDMEBAASINIMI");
if ($mysqli->connect_error) {
    die("Ühendus ebaõnnestus: " . $mysqli->connect_error);
}

$type = $_POST['type'] ?? null;

switch ($type) {
    case 'testiSalvestus':
        $testisooritus_id = $_POST['testisooritus_id'];
        $lahendaja_id = $_POST['lahendaja_id'];
        $stmt = $mysqli->prepare("UPDATE testisooritus SET l6pp = NOW() WHERE id = ? AND lahendaja_id = ?");
        $stmt->bind_param("ii", $testisooritus_id, $lahendaja_id);
        echo $stmt->execute() ? "Test salvestatud!" : "Viga salvestamisel.";
        break;

    case 'detailiSalvestus':
        $test_id = $_POST['test_id'];
        $field = $_POST['some_field'];
        $stmt = $mysqli->prepare("UPDATE test SET kirjeldus = ? WHERE id = ?");
        $stmt->bind_param("si", $field, $test_id);
        echo $stmt->execute() ? "Detail salvestatud!" : "Viga detaili salvestamisel.";
        break;

    case 'kustuta':
        $test_id = $_POST['test_id'];
        $stmt = $mysqli->prepare("DELETE FROM test WHERE id = ?");
        $stmt->bind_param("i", $test_id);
        echo $stmt->execute() ? "Test kustutatud!" : "Viga kustutamisel.";
        break;

    case 'link':
        $test_id = $_POST['test_id'];
        $token = bin2hex(random_bytes(8));
        $stmt = $mysqli->prepare("INSERT INTO test_link (test_id, share_token) VALUES (?, ?)");
        $stmt->bind_param("is", $test_id, $token);
        $stmt->execute();
        echo "https://yourdomain.com/test?token=" . htmlspecialchars($token);
        break;
    
    case 'pdf':
        $test_id = $_POST['test_id'];
        
        // Optional: load and format content from DB (this is a placeholder)
        $html = "<h1>Test PDF</h1><p>See on test ID: " . htmlspecialchars($test_id) . "</p>";

        // Generate PDF using MPDF
        require_once __DIR__ . '/vendor/autoload.php';
        $mpdf = new \Mpdf\Mpdf();
        $mpdf->WriteHTML($html);
        $filename = "test_" . $test_id . ".pdf";

        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        $mpdf->Output($filename, \Mpdf\Output\Destination::INLINE);
        exit;

    default:
        echo "Tundmatu tegevus.";
}
?>
