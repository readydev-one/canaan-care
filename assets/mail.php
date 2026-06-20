<?php
// Include PHPMailer classes manually
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name     = isset($_POST["name"])     ? trim($_POST["name"])     : "";
    $company  = isset($_POST["company"])  ? trim($_POST["company"])  : "";
    $phone    = isset($_POST["phone"])    ? trim($_POST["phone"])    : "";
    $service  = isset($_POST["service"])  ? trim($_POST["service"])  : "";
    $message  = isset($_POST["message"])  ? trim($_POST["message"])  : "";
    $checkbox = isset($_POST["checkbox"]) ? trim($_POST["checkbox"]) : "";
    // Sanitize email separately as it's not a ternary based on isset
    $email    = isset($_POST["email"]) ? filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL) : "";

    // Validation
    if ( empty($name) OR empty($company) OR empty($service) OR empty($message) OR empty($phone) OR empty($checkbox) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {

        // Set a 400 (bad request) response code and exit.

        http_response_code(400);

        echo "Please complete the form and try again.";

        exit;

    }


    // Recipient
    $recipient = "youremail@gmail.com";

    // HTML email content
    $email_content = "
    <html>
    <head>
        <title>New Contact Form</title>
    </head>
    <body style='font-family: Arial, sans-serif;'>
        <h2 style='color:#333;'>New Contact Request</h2>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Company:</strong> {$company}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Phone:</strong> {$phone}</p>
        <p><strong>Service:</strong> {$service}</p>
        <p><strong>Checkbox:</strong> {$checkbox}</p>
        <p><strong>Message:</strong><br>".nl2br($message)."</p>
        <hr>
        <p style='font-size:12px;color:#999;'>This email was sent from Aqlova Aleric HTML template.</p>
    </body>
    </html>
    ";

    // PHPMailer setup
    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.yourhosting.com';  // Your hosting SMTP server (example: smtp.yourhosting.com)
        $mail->SMTPAuth   = true;
        $mail->Username   = 'yourname@yourdomain.com'; // Your email address (must be from hosting server)
        $mail->Password   = 'your_email_password_here'; // Your email password ( Replace with your real email password)
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465; // SMTP Port (465 for SSL, 587 for TLS)
  

        //Recipients
        $mail->setFrom('yourname@yourdomain.com', 'Your Website Contact Form'); // "From" address (Sender email & name shown in inbox)
        $mail->addAddress($recipient); // Admin inbox
        $mail->addReplyTo($email, $name); // User reply



        // Content
        $mail->isHTML(true);
        $mail->Subject = "New contact from $name - $service";
        $mail->Body    = $email_content;
        $mail->AltBody = strip_tags($email_content);

        $mail->send();

        http_response_code(200);
        echo "Thank You! Your message has been sent.";
    } catch (Exception $e) {
        http_response_code(500);
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }

} else {
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?>
