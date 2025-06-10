<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $to = "teaduskook@tlu.ee";

    $subject = "Kontaktivorm: " . htmlspecialchars($_POST['title']);
    $message = "Sõnum:\n" . htmlspecialchars($_POST['content']) . "\n\n"
             . "Saatja e-post: " . htmlspecialchars($_POST['email']);

    $headers = "From:noreply@example.com\r\n";
    $headers .= "Reply-To: " . htmlspecialchars($_POST['email']) . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8";

    if (mail($to, $subject, $message, $headers)) {
        echo "Kiri saadeti edukalt!";
    } else {
        echo "Meili saatmine ebaõnnestus.";
    }
} else {
    echo "Vigane päring.";
}
?>