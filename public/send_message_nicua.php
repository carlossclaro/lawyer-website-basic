<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Load configuration
require_once 'config_smtp.php';

// Function to send email using PHPMailer with nic.ua SMTP
function sendEmailNicUA($name, $email, $phone, $message) {
    global $smtp_host, $smtp_port, $smtp_username, $smtp_password, $smtp_secure, $email_to;
    
    // Check if PHPMailer is available
    if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        // Fallback to basic mail() function
        return sendEmailBasic($name, $email, $phone, $message);
    }
    
    try {
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        
        // Server settings
        $mail->isSMTP();
        $mail->Host = $smtp_host;
        $mail->SMTPAuth = true;
        $mail->Username = $smtp_username;
        $mail->Password = $smtp_password;
        $mail->SMTPSecure = $smtp_secure;
        $mail->Port = $smtp_port;
        $mail->CharSet = 'UTF-8';
        
        // Recipients
        $mail->setFrom($smtp_username, 'Website Contact Form');
        $mail->addAddress($email_to);
        $mail->addReplyTo($email, $name);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Нове повідомлення з сайту - ' . $name;
        
        // Create email body
        $emailBody = "🔔 <b>Нове повідомлення з сайту</b><br><br>";
        $emailBody .= "👤 <b>Ім'я:</b> " . $name . "<br>";
        $emailBody .= "📧 <b>Email:</b> " . $email . "<br>";
        $emailBody .= "📞 <b>Телефон:</b> " . $phone . "<br>";
        $emailBody .= "💬 <b>Повідомлення:</b><br>" . nl2br($message) . "<br><br>";
        $emailBody .= "⏰ <b>Час:</b> " . date('d.m.Y H:i:s') . "<br>";
        $emailBody .= "🌐 <b>IP:</b> " . $_SERVER['REMOTE_ADDR'] . "<br><br>";
        $emailBody .= "---<br><br>";
        $emailBody .= "🔔 <b>New message from website</b><br><br>";
        $emailBody .= "👤 <b>Name:</b> " . $name . "<br>";
        $emailBody .= "📧 <b>Email:</b> " . $email . "<br>";
        $emailBody .= "📞 <b>Phone:</b> " . $phone . "<br>";
        $emailBody .= "💬 <b>Message:</b><br>" . nl2br($message) . "<br><br>";
        $emailBody .= "⏰ <b>Time:</b> " . date('d.m.Y H:i:s') . "<br>";
        $emailBody .= "🌐 <b>IP:</b> " . $_SERVER['REMOTE_ADDR'];
        
        $mail->Body = $emailBody;
        $mail->AltBody = strip_tags(str_replace('<br>', "\n", $emailBody));
        
        $mail->send();
        return true;
        
    } catch (Exception $e) {
        // Log the error
        $logEntry = date('Y-m-d H:i:s') . " - PHPMailer Error: " . $e->getMessage() . "\n";
        file_put_contents('contact_log.txt', $logEntry, FILE_APPEND | LOCK_EX);
        
        // Fallback to basic mail() function
        return sendEmailBasic($name, $email, $phone, $message);
    }
}

// Fallback function using basic mail()
function sendEmailBasic($name, $email, $phone, $message) {
    global $email_to;
    
    $subject = 'Нове повідомлення з сайту - ' . $name;
    
    // Create email body
    $emailBody = "🔔 <b>Нове повідомлення з сайту</b><br><br>";
    $emailBody .= "👤 <b>Ім'я:</b> " . $name . "<br>";
    $emailBody .= "📧 <b>Email:</b> " . $email . "<br>";
    $emailBody .= "📞 <b>Телефон:</b> " . $phone . "<br>";
    $emailBody .= "💬 <b>Повідомлення:</b><br>" . nl2br($message) . "<br><br>";
    $emailBody .= "⏰ <b>Час:</b> " . date('d.m.Y H:i:s') . "<br>";
    $emailBody .= "🌐 <b>IP:</b> " . $_SERVER['REMOTE_ADDR'] . "<br><br>";
    $emailBody .= "---<br><br>";
    $emailBody .= "🔔 <b>New message from website</b><br><br>";
    $emailBody .= "👤 <b>Name:</b> " . $name . "<br>";
    $emailBody .= "📧 <b>Email:</b> " . $email . "<br>";
    $emailBody .= "📞 <b>Phone:</b> " . $phone . "<br>";
    $emailBody .= "💬 <b>Message:</b><br>" . nl2br($message) . "<br><br>";
    $emailBody .= "⏰ <b>Time:</b> " . date('d.m.Y H:i:s') . "<br>";
    $emailBody .= "🌐 <b>IP:</b> " . $_SERVER['REMOTE_ADDR'];
    
    // Email headers
    $headers = array();
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=UTF-8';
    $headers[] = 'From: noreply@gp.od.ua';
    $headers[] = 'Reply-To: ' . $email;
    $headers[] = 'X-Mailer: PHP/' . phpversion();
    
    return mail($email_to, $subject, $emailBody, implode("\r\n", $headers));
}

// Function to validate email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Function to sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Get form data
    $name = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? sanitizeInput($_POST['phone']) : '';
    $message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($phone) || empty($message)) {
        throw new Exception('Всі поля обов\'язкові для заповнення');
    }
    
    // Validate email
    if (!isValidEmail($email)) {
        throw new Exception('Невірний формат email');
    }
    
    // Validate name length
    if (strlen($name) < 2 || strlen($name) > 100) {
        throw new Exception('Ім\'я повинно містити від 2 до 100 символів');
    }
    
    // Validate phone length
    if (strlen($phone) < 10 || strlen($phone) > 20) {
        throw new Exception('Невірний формат номера телефону');
    }
    
    // Validate message length
    if (strlen($message) < 10 || strlen($message) > 2000) {
        throw new Exception('Повідомлення повинно містити від 10 до 2000 символів');
    }
    
    // Send email using nic.ua optimized method
    $emailResult = sendEmailNicUA($name, $email, $phone, $message);
    
    if ($emailResult) {
        // Log successful submission
        $logEntry = date('Y-m-d H:i:s') . " - Success: " . $name . " (" . $email . ")\n";
        file_put_contents('contact_log.txt', $logEntry, FILE_APPEND | LOCK_EX);
        
        echo json_encode([
            'success' => true,
            'message' => 'Дякуємо! Ваше повідомлення успішно надіслано. Ми зв\'яжемося з вами найближчим часом.'
        ]);
    } else {
        // Log failed submission
        $logEntry = date('Y-m-d H:i:s') . " - Failed: " . $name . " (" . $email . ") - Email sending failed\n";
        file_put_contents('contact_log.txt', $logEntry, FILE_APPEND | LOCK_EX);
        
        throw new Exception('Помилка відправки повідомлення. Спробуйте ще раз або зв\'яжіться з нами по телефону.');
    }
    
} catch (Exception $e) {
    // Log error
    $logEntry = date('Y-m-d H:i:s') . " - Error: " . $e->getMessage() . "\n";
    file_put_contents('contact_log.txt', $logEntry, FILE_APPEND | LOCK_EX);
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
