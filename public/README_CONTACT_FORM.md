# Contact Form Setup Instructions

This contact form sends messages to a Telegram bot. Follow these steps to set it up:

## Step 1: Create a Telegram Bot

1. **Open Telegram** and search for `@BotFather`
2. **Start a chat** with BotFather
3. **Send the command**: `/newbot`
4. **Follow the instructions**:
   - Choose a name for your bot (e.g., "Law Firm Contact Bot")
   - Choose a username (must end with 'bot', e.g., "lawfirm_contact_bot")
5. **Save the bot token** that BotFather gives you (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Step 2: Get Your Chat ID

### Method 1: Using @userinfobot
1. Search for `@userinfobot` in Telegram
2. Start a chat with it
3. Send any message
4. It will reply with your chat ID (a number like `123456789`)

### Method 2: Using your bot
1. Start a chat with your bot
2. Send any message to it
3. Visit this URL in your browser (replace with your bot token):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN_HERE/getUpdates
   ```
4. Look for the "chat" object and find the "id" field

## Step 3: Configure the Form

1. **Open `config.php`** in the public folder
2. **Replace the placeholder values**:
   ```php
   $telegram_bot_token = 'YOUR_ACTUAL_BOT_TOKEN';
   $telegram_chat_id = 'YOUR_ACTUAL_CHAT_ID';
   ```

## Step 4: Test the Form

1. **Fill out the contact form** on your website
2. **Submit the form**
3. **Check your Telegram** - you should receive a message like:
   ```
   🔔 Нове повідомлення з сайту

   👤 Ім'я: John Doe
   📧 Email: john@example.com
   📞 Телефон: +380123456789
   💬 Повідомлення:
   Hello, I need legal consultation...

   ⏰ Час: 15.12.2024 14:30:25
   🌐 IP: 192.168.1.1
   ```

## Security Features

- **Input validation**: All fields are validated for format and length
- **XSS protection**: Input is sanitized to prevent malicious code
- **Rate limiting**: Configurable to prevent spam
- **Error logging**: All errors are logged to `contact_log.txt`

## Customization

### Change Message Format
Edit the `$telegramMessage` variable in `send_message.php` to customize the message format.

### Add More Fields
1. Add new input fields to the HTML form
2. Update the PHP script to handle the new fields
3. Modify the Telegram message format

### Change Validation Rules
Edit the validation functions in `send_message.php`:
- `isValidEmail()` - Email validation
- Field length limits in the main validation section

## Troubleshooting

### Form not working?
1. Check that PHP is enabled on your server
2. Verify the bot token and chat ID are correct
3. Check the browser console for JavaScript errors
4. Look at the `contact_log.txt` file for PHP errors

### Messages not arriving in Telegram?
1. Make sure you've started a chat with your bot
2. Verify the chat ID is correct
3. Check that the bot token is valid
4. Test the bot API directly:
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN_HERE/getMe
   ```

### Server errors?
1. Check PHP error logs
2. Verify file permissions (PHP needs to write to `contact_log.txt`)
3. Make sure `config.php` is readable by PHP

## File Structure

```
public/
├── index.html          # Main page with contact form
├── contact-us.html     # Contact page with form
├── info.html          # Info page with form
├── send_message.php   # Form processing script
├── config.php         # Configuration file
├── script.js          # JavaScript for form handling
├── css/styles.css     # CSS styles
└── contact_log.txt    # Log file (created automatically)
```

## Support

If you need help setting up the contact form, check:
1. The `contact_log.txt` file for error messages
2. Your server's PHP error logs
3. The browser's developer console for JavaScript errors
