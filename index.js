const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const config = require('./config');
const path = require('path');
const fs = require('fs');
const { handleMessage } = require('./utils/messageHandler');
const { setupCommands } = require('./utils/commands');

const sessionsDir = path.join(__dirname, 'sessions');

if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir, { recursive: true });
}

async function startBot() {
  try {
    console.log('🤖 Starting SIMON-TECH-BOT...');
    
    const { state, saveCreds } = await useMultiFileAuthState(
      path.join(sessionsDir, 'SIMON')
    );

    const { version } = await fetchLatestBaileysVersion();

    const socket = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: true,
    });

    socket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('📱 Scan the QR code above to pair your WhatsApp');
      }

      if (connection === 'open') {
        console.log('✅ Bot connected successfully!');
        console.log('🎉 SIMON-TECH-BOT is now online!');
      }

      if (connection === 'close') {
        const shouldReconnect =
          lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('❌ Connection closed:', lastDisconnect?.error);
        if (shouldReconnect) {
          console.log('🔄 Reconnecting...');
          startBot();
        }
      }
    });

    socket.ev.on('creds.update', saveCreds);

    socket.ev.on('messages.upsert', async (m) => {
      const message = m.messages[0];
      if (!message.message) return;

      console.log(`📨 Message from ${message.key.remoteJid}: ${JSON.stringify(message.message)}`);
      
      // Handle incoming messages
      await handleMessage(socket, message, config);
    });

    setupCommands(socket, config);

  } catch (error) {
    console.error('❌ Error starting bot:', error);
    setTimeout(() => startBot(), 5000);
  }
}

// Start the bot
startBot();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Bot shutting down gracefully...');
  process.exit(0);
});
