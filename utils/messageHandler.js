const { proto } = require('@whiskeysockets/baileys');

async function handleMessage(socket, message, config) {
  try {
    const jid = message.key.remoteJid;
    const text = message.message?.conversation ||
                 message.message?.extendedTextMessage?.text ||
                 '';

    if (!text) return;

    const prefix = config.botPrefix;
    
    // Check if message starts with prefix
    if (!text.startsWith(prefix)) {
      return;
    }

    const commandText = text.slice(prefix.length).trim();
    const [command, ...args] = commandText.split(' ');

    // Handle commands
    switch (command.toLowerCase()) {
      case 'ping':
        await socket.sendMessage(jid, { 
          text: '🏓 Pong! Bot is alive!' 
        });
        break;

      case 'menu':
        const menuText = `
╔═══════════════════════════════╗
║  🤖 SIMON-TECH-BOT MENU      ║
���═══════════════════════════════╝

${config.botPrefix}ping - Check bot status
${config.botPrefix}menu - Show this menu
${config.botPrefix}help - Get help
${config.botPrefix}status - Bot status

Made with ❤️
        `;
        await socket.sendMessage(jid, { text: menuText });
        break;

      case 'help':
        await socket.sendMessage(jid, {
          text: `📖 SIMON-TECH-BOT Help\n\nUse ${config.botPrefix}menu to see available commands.`
        });
        break;

      case 'status':
        await socket.sendMessage(jid, {
          text: `✅ Status: Online\n🤖 Bot: ${config.botName}\n⚡ Ready to serve!`
        });
        break;

      default:
        await socket.sendMessage(jid, {
          text: `❓ Unknown command: ${command}\nType ${config.botPrefix}menu for available commands.`
        });
    }

  } catch (error) {
    console.error('Error handling message:', error);
  }
}

module.exports = { handleMessage };
