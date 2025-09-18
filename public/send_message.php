<?php
// Set headers for JSON response and CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Load configuration
require_once 'config.php';

// Function to send email
function sendEmail($name, $email, $phone, $message) {
    $to = 'office@gp.od.ua';
    $subject = 'Нове повідомлення з сайту - ' . $name;
    
    // Create email body
    $emailBody = "🔔 <b>Нове повідомлення з сайту</b><br><br>";
    $emailBody .= "👤 <b>Ім'я:</b> " . $name . "<br>";
    $emailBody .= "📧 <b>Email:</b> " . $email . "<br>";
    $emailBody .= "📞 <b>Телефон:</b> " . $phone . "<br>";
    $emailBody .= "💬 <b>Повідомлення:</b><br>" . nl2br($message) . "<br><br>";
    $emailBody .= "⏰ <b>Час:</b> " . date('d.m.Y H:i:s') . "<br>";
    $emailBody .= "🌐 <b>IP:</b> " . $_SERVER['REMOTE_ADDR'] . "<br>";
    $emailBody .= "🔗 <b>Referer:</b> " . (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'Direct access') . "<br><br>";
    $emailBody .= "---<br><br>";
    $emailBody .= "🔔 <b>New message from website</b><br><br>";
    $emailBody .= "👤 <b>Name:</b> " . $name . "<br>";
    $emailBody .= "📧 <b>Email:</b> " . $email . "<br>";
    $emailBody .= "📞 <b>Phone:</b> " . $phone . "<br>";
    $emailBody .= "💬 <b>Message:</b><br>" . nl2br($message) . "<br><br>";
    $emailBody .= "⏰ <b>Time:</b> " . date('d.m.Y H:i:s') . "<br>";
    $emailBody .= "🌐 <b>IP:</b> " . $_SERVER['REMOTE_ADDR'] . "<br>";
    $emailBody .= "🔗 <b>Referer:</b> " . (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'Direct access');
    
    // Email headers
    $headers = array();
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=UTF-8';
    $headers[] = 'From: ' . $email;
    $headers[] = 'Reply-To: ' . $email;
    $headers[] = 'X-Mailer: PHP/' . phpversion();
    
    // Send email
    return mail($to, $subject, $emailBody, implode("\r\n", $headers));
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

// Rate limiting - only security measure
$ip = $_SERVER['REMOTE_ADDR'];
$currentTime = time();
$spamLogFile = 'spam_protection.txt';

// Check for rapid submissions (same IP)
$spamData = [];
if (file_exists($spamLogFile)) {
    $spamData = json_decode(file_get_contents($spamLogFile), true) ?: [];
}

// Clean old entries (older than 1 hour)
$spamData = array_filter($spamData, function($entry) use ($currentTime) {
    return $currentTime - $entry['time'] < 3600;
});

// Check if this IP has submitted too many times recently (max 10 per hour)
$ipSubmissions = array_filter($spamData, function($entry) use ($ip) {
    return $entry['ip'] === $ip;
});

if (count($ipSubmissions) >= 10) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Забагато спроб. Спробуйте пізніше.']);
    exit;
}

// Check for rapid submissions (less than 10 seconds apart)
$recentSubmissions = array_filter($ipSubmissions, function($entry) use ($currentTime) {
    return $currentTime - $entry['time'] < 10;
});

if (count($recentSubmissions) > 0) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Занадто швидко. Зачекайте 10 секунд.']);
    exit;
}

// Add current submission to spam log
$spamData[] = [
    'ip' => $ip,
    'time' => $currentTime
];

file_put_contents($spamLogFile, json_encode($spamData));

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
    if (strlen($message) < 5 || strlen($message) > 2000) {
        throw new Exception('Повідомлення повинно містити від 5 до 2000 символів');
    }
    
    // Send email
    $emailResult = sendEmail($name, $email, $phone, $message);
    
    if ($emailResult) {
        // Log successful submission
        $logEntry = date('Y-m-d H:i:s') . " - Success: " . $name . " (" . $email . ")\n";
        file_put_contents('contact_log.txt', $logEntry, FILE_APPEND | LOCK_EX);
        
        echo json_encode([
            'success' => true,
            'message' => 'Дякуємо! Ваше повідомлення успішно надіслано. Ми зв\'яжемося з вами найближчим часом.'
        ]);
    } else {
        throw new Exception('Помилка при надсиланні повідомлення. Спробуйте ще раз або зв\'яжіться з нами безпосередньо.');
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
