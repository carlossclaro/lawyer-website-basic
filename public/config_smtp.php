<?php
// nic.ua SMTP Configuration
// Use this configuration if the basic mail() function doesn't work

// Email Configuration
$email_to = 'office@gp.od.ua';

// nic.ua SMTP Settings for gp.od.ua
$smtp_host = 'mail.gp.od.ua';  // Your SMTP server
$smtp_port = 587;  // Usually 587 for TLS or 465 for SSL
$smtp_username = 'your-email@gp.od.ua';  // Your email address
$smtp_password = 'your-email-password';  // Your email password
$smtp_secure = 'tls';  // 'tls' or 'ssl'

// Optional: Enable/disable logging
$enable_logging = true;

// Optional: Maximum message length
$max_message_length = 2000;

// Optional: Rate limiting (messages per hour per IP)
$rate_limit_messages_per_hour = 5;

// Security: Enable CSRF protection
$enable_csrf_protection = true;

// Security: Allowed domains (empty array means all domains)
$allowed_domains = [];

// Error reporting (set to false in production)
$debug_mode = false;

if ($debug_mode) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}
?>
