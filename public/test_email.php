<?php
// Simple email test script
// Access this file in your browser to test if emails are working

echo "<h2>Email Test Results</h2>";

// Test 1: Check if mail() function exists
if (function_exists('mail')) {
    echo "✅ PHP mail() function is available<br>";
} else {
    echo "❌ PHP mail() function is NOT available<br>";
    exit;
}

// Test 2: Check PHP configuration
echo "<h3>PHP Configuration:</h3>";
echo "sendmail_path: " . ini_get('sendmail_path') . "<br>";
echo "SMTP: " . ini_get('SMTP') . "<br>";
echo "smtp_port: " . ini_get('smtp_port') . "<br>";

// Test 3: Try to send a test email
echo "<h3>Test Email:</h3>";
$to = 'office@gp.od.ua';
$subject = 'Test Email from Website - ' . date('Y-m-d H:i:s');
$message = "This is a test email to verify that the contact form will work properly.\n\n";
$message .= "Time: " . date('Y-m-d H:i:s') . "\n";
$message .= "Server: " . $_SERVER['SERVER_NAME'] . "\n";
$message .= "IP: " . $_SERVER['SERVER_ADDR'] . "\n";

$headers = array();
$headers[] = 'From: noreply@gp.od.ua';
$headers[] = 'Reply-To: noreply@gp.od.ua';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$result = mail($to, $subject, $message, implode("\r\n", $headers));

if ($result) {
    echo "✅ Test email sent successfully!<br>";
    echo "Check your inbox at: $to<br>";
} else {
    echo "❌ Test email failed to send<br>";
    echo "This means your server needs email configuration.<br>";
}

// Test 4: Check for common issues
echo "<h3>Common Issues Check:</h3>";

// Check if we can write to the log file
$logFile = 'contact_log.txt';
if (is_writable($logFile) || is_writable(dirname($logFile))) {
    echo "✅ Log file is writable<br>";
} else {
    echo "❌ Log file is NOT writable<br>";
}

// Check PHP error log
$errorLog = ini_get('error_log');
if ($errorLog) {
    echo "Error log location: $errorLog<br>";
} else {
    echo "No error log configured<br>";
}

echo "<h3>Next Steps:</h3>";
echo "1. If the test email failed, contact your hosting provider<br>";
echo "2. Ask them to enable/configure SMTP for your server<br>";
echo "3. Some providers require you to use their SMTP settings<br>";
echo "4. For local development, consider using Mailtrap or similar service<br>";
?>
