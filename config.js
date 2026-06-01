const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  sessionId: process.env.SESSION_ID,
  botName: process.env.BOT_NAME || 'SIMON',
  botPrefix: process.env.BOT_PREFIX || '.',
  ownerNumber: process.env.OWNER_NUMBER,
  port: process.env.PORT || 3000,
  
  // Bot Settings
  autoRead: true,
  autoTyping: false,
  autoRecording: false,
  
  // Command Settings
  commands: {
    enabled: true,
    prefix: process.env.BOT_PREFIX || '.',
  },
  
  // Auto-reply settings
  autoReply: {
    enabled: true,
    defaultMessage: 'Bot is online! Type .menu for commands.',
  },
};
