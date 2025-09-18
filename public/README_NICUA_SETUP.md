# nic.ua Email Setup Guide

## Step 1: Test Basic Email Function
1. Upload `test_email.php` to your server
2. Visit `yourdomain.com/test_email.php`
3. Check if the test passes

## Step 2: Get Your nic.ua Email Settings
Log into your nic.ua control panel and find:
- **Email address**: your-email@gp.od.ua
- **Email password**: Your email password
- **SMTP server**: Usually `mail.gp.od.ua`
- **SMTP port**: Usually 587 (TLS) or 465 (SSL)
- **Security**: TLS or SSL

## Step 3: Configure SMTP Settings
Edit `config_smtp.php` and update these values:
```php
$smtp_host = 'mail.gp.od.ua';  // Your SMTP server
$smtp_port = 587;  // Your SMTP port
$smtp_username = 'your-email@gp.od.ua';  // Your email
$smtp_password = 'your-email-password';  // Your password
$smtp_secure = 'tls';  // 'tls' or 'ssl'
```

## Step 4: Choose Your Email Method

### Option A: Use Basic mail() Function (Simplest)
- Rename `send_message.php` to `send_message_backup.php`
- Rename `send_message_nicua.php` to `send_message.php`
- Update your HTML forms to use the new file

### Option B: Use PHPMailer (More Reliable)
1. Download PHPMailer from https://github.com/PHPMailer/PHPMailer
2. Extract and upload these files to your server:
   - `src/PHPMailer.php`
   - `src/SMTP.php`
   - `src/Exception.php`
3. Add this to the top of `send_message_nicua.php`:
```php
require 'PHPMailer.php';
require 'SMTP.php';
require 'Exception.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
```

## Step 5: Update Your HTML Forms
Make sure your contact forms point to the correct PHP file:
```html
<form action="send_message.php" method="POST">
```

## Step 6: Test the Contact Form
1. Fill out your contact form
2. Submit it
3. Check if you receive the email at `office@gp.od.ua`
4. Check the `contact_log.txt` file for any errors

## Common nic.ua Issues and Solutions

### Issue: "mail() function not available"
**Solution**: Contact nic.ua support to enable PHP mail functions

### Issue: "SMTP authentication failed"
**Solution**: 
- Double-check your email credentials
- Make sure you're using the correct SMTP server
- Try port 465 with SSL instead of 587 with TLS

### Issue: "Connection timeout"
**Solution**:
- Check if your hosting plan includes email services
- Contact nic.ua support for SMTP settings

### Issue: "Emails going to spam"
**Solution**:
- Use PHPMailer instead of basic mail()
- Set proper From headers
- Configure SPF/DKIM records (ask nic.ua support)

## nic.ua Support Contact
If you need help with email configuration:
- Email: support@nic.ua
- Phone: +380 44 490-90-90
- Live chat available on their website

## Alternative: Use External Email Service
If nic.ua email doesn't work, consider:
- **Gmail SMTP** (requires app password)
- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 5,000 emails/month)

## Monitoring
The system creates a `contact_log.txt` file that logs:
- Successful submissions
- Failed attempts
- Error messages

Check this file regularly to monitor email delivery.
