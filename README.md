# 🤖 SIMON-TECH-BOT

![SIMON-TECH Bot](assets/bot-appearance.png)

SIMON-v2 is a powerful WhatsApp bot built with Baileys. It supports commands like ping, menu, auto replies, and more. Easily deploy using GitHub and run on platforms like Replit. Simple setup, fast performance, and customizable features for automation and fun.

## 📋 Features

- ✅ WhatsApp bot with Baileys integration
- ✅ Command system (ping, menu, etc.)
- ✅ Auto-reply functionality
- ✅ Easy deployment on Replit/Heroku
- ✅ Customizable commands and responses
- ✅ Fast performance and reliability
- ✅ AI Powered System
- ✅ Multi-Device Support
- ✅ 300+ Commands Available

## 🤝 Join Our Community

Connect with us and get support:

- **📱 WhatsApp Group:** [Join Group](https://chat.whatsapp.com/KTlgMttDWxC04ZoiJCnz23)

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn
- WhatsApp account for pairing

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/veriferjp-coder/SIMON-TECH-BOT.git
cd SIMON-TECH-BOT
```

2. **Install dependencies**
```bash
npm install
```

3. **Generate Session ID** (See below)

4. **Configure your bot**
   - Add SESSION_ID to your `.env` file
   - Customize commands in `config.js`

5. **Start the bot**
```bash
npm start
```

## 🔐 How to Get Your Session ID

### Method 1: Using Session Generator (Local)

1. **Run the session generator**
```bash
npm run session
```

2. **Open in your browser**
   - Go to `http://localhost:3000`

3. **Generate QR Code**
   - Click "Generate QR Code" button

4. **Scan with WhatsApp**
   - Open WhatsApp on your phone
   - Go to Settings → Linked Devices
   - Tap "Link a Device"
   - Scan the QR code displayed

5. **Copy SESSION_ID**
   - Once paired, your SESSION_ID will appear
   - Click "Copy SESSION_ID" button

### Method 2: Using Replit (Online)

1. **Fork this repository to Replit**
   - Click "Fork on Replit" button (if available)

2. **Run the project**
   - Click Run button

3. **Access session generator**
   - Open the webview URL
   - Go to `/session` path

4. **Follow the same steps as above**

### Method 3: Manual Session Generation

```bash
node session-generator.js
```

Then open `http://localhost:3000` in your browser.

## 📝 Configuration

### .env File
Create a `.env` file in the root directory:

```env
SESSION_ID=your_session_id_here
BOT_NAME=SIMON
BOT_PREFIX=.
OWNER_NUMBER=your_number_here
```

### Commands File
Edit `commands/` directory to add custom commands.

## 📦 Project Structure

```
SIMON-TECH-BOT/
├── session-generator.js    # Session ID generator
├── index.js               # Main bot file
├── config.js              # Configuration
├── commands/              # Custom commands
├── utils/                 # Utility functions
├── assets/                # Bot appearance and assets
├── .env                   # Environment variables
└── package.json           # Dependencies
```

## 🎯 Usage

### Run the Bot Locally
```bash
npm start
```

### Generate Session ID
```bash
npm run session
```

### Deploy to Replit

1. Fork the repository to Replit
2. Set environment variables in Secrets
3. Run the project
4. Use the Replit URL for session generator

### Deploy to Heroku

```bash
heroku login
heroku create your-bot-name
git push heroku main
```

## 📱 Commands

Default commands (customize in `commands/` folder):

- `.ping` - Check if bot is alive
- `.menu` - Show available commands
- `.help` - Get help information
- `.status` - Show bot status

## 🔧 Troubleshooting

### QR Code not scanning?
- Make sure WhatsApp is properly installed
- Check your internet connection
- Try refreshing the page

### Session ID not generating?
- Restart the session generator
- Check console for errors
- Make sure port 3000 is available

### Bot not responding?
- Verify SESSION_ID is correct
- Check bot is running: `npm start`
- Ensure WhatsApp is connected

## 📧 Support

For issues and support:
- Open an issue on GitHub
- Check existing issues first
- Provide error logs and details
- Join our WhatsApp group for community support

## 📄 License

This project is open source and available under the MIT License.

## ⚠️ Disclaimer

This bot is for educational purposes. Respect WhatsApp's Terms of Service. Use responsibly and don't spam.

---

**Made with ❤️ by SIMON-TECH-BOT**

Need help? [Create an issue](https://github.com/veriferjp-coder/SIMON-TECH-BOT/issues) or [Join WhatsApp Group](https://chat.whatsapp.com/KTlgMttDWxC04ZoiJCnz23)
