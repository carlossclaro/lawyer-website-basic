<?php
// Email Configuration
// Email address where contact form messages will be sent
$email_to = 'office@gp.od.ua';

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
