const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, jidDecode } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const menu = require('./menu');

// Configuration
const config = {
    sessionName: 'SIMON',
    ownerNumber: process.env.OWNER_NUMBER || '2349166265317',
    botName: process.env.BOT_NAME || 'SIMON',
    prefix: process.env.BOT_PREFIX || '.',
    botVersion: process.env.BOT_VERSION || '1.0.3'
};

// Store bot socket globally
let sock = null;
let isConnected = false;

// Message counter for stats
let messageCount = 0;
const startTime = Date.now();

// Get bot uptime
function getUptime() {
    const uptime = Date.now() - startTime;
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Main bot function
async function startBot() {
    try {
        console.log('🤖 Starting SIMON-TECH-BOT...');
        
        const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'sessions', config.sessionName));
        const { version, isLatest } = await fetchLatestBaileysVersion();

        sock = makeWASocket({
            version,
            auth: state,
            printQRInTerminal: true,
            browser: ['SIMON-TECH-BOT', 'Chrome', '10.0.0'],
            logger: require('@whiskeysockets/baileys/lib/logger').default('silent')
        });

        // Connection update
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                console.log('📱 QR Code generated. Scan it with WhatsApp.');
            }

            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log('❌ Connection closed. Attempting to reconnect...');
                if (shouldReconnect) {
                    setTimeout(() => startBot(), 3000);
                }
            } else if (connection === 'open') {
                isConnected = true;
                console.log('✅ Bot connected successfully!');
                console.log(`🚀 SIMON-TECH-BOT v${config.botVersion} is online`);
            }
        });

        // Credentials update
        sock.ev.on('creds.update', saveCreds);

        // Message handling
        sock.ev.on('messages.upsert', async (m) => {
            try {
                const message = m.messages[0];
                if (!message.message) return;

                const from = message.key.remoteJid;
                const isGroup = from.endsWith('@g.us');
                const sender = isGroup ? message.key.participant : from;
                const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
                const isBotMessage = message.key.fromMe;

                // Get message text
                let text = '';
                if (message.message.conversation) {
                    text = message.message.conversation;
                } else if (message.message.extendedTextMessage?.text) {
                    text = message.message.extendedTextMessage.text;
                }

                const command = text.toLowerCase().split(' ')[0];
                const args = text.split(' ').slice(1);

                messageCount++;

                console.log(`\n📨 New message from ${sender}`);
                console.log(`   Text: ${text.substring(0, 50)}...`);

                // Command handler
                if (text.startsWith(config.prefix)) {
                    const cmd = command.slice(config.prefix.length);

                    // Menu command
                    if (cmd === 'menu') {
                        await sock.sendMessage(from, { text: menu });
                    }

                    // Ping command
                    else if (cmd === 'ping') {
                        const ping = Date.now();
                        const msg = await sock.sendMessage(from, { text: '🏓 Pong!' });
                        const delay = Date.now() - ping;
                        await sock.sendMessage(from, { text: `⚡ Speed: ${delay}ms` });
                    }

                    // Alive command
                    else if (cmd === 'alive') {
                        const aliveText = `╔════════════════════════════╗
║ ✅ SIMON-TECH-BOT ALIVE ✅ ║
╚════════════════════════════╝

🤖 Bot Name: ${config.botName}
📱 Version: v${config.botVersion}
⚡ Status: Online
🚀 Speed: Ultra Fast
📊 Uptime: ${getUptime()}
💬 Messages: ${messageCount}
👑 Owner: ${config.ownerNumber}

Made with ❤️ by SIMON TECH`;
                        await sock.sendMessage(from, { text: aliveText });
                    }

                    // Help command
                    else if (cmd === 'help') {
                        const helpText = `╔════════════════════════════╗
║ 📖 SIMON-TECH-BOT HELP 📖  ║
╚════════════════════════════╝

Available Commands:
${config.prefix}menu - Show all commands
${config.prefix}ping - Check bot speed
${config.prefix}alive - Bot status
${config.prefix}help - Show this message
${config.prefix}uptime - Bot uptime
${config.prefix}owner - Bot owner info

More features coming soon! 🚀`;
                        await sock.sendMessage(from, { text: helpText });
                    }

                    // Uptime command
                    else if (cmd === 'uptime') {
                        const uptimeText = `⏱️ Bot Uptime: ${getUptime()}`;
                        await sock.sendMessage(from, { text: uptimeText });
                    }

                    // Owner command
                    else if (cmd === 'owner') {
                        const ownerText = `👑 SIMON-TECH-BOT Owner
━━━━━━━━━━━━━━━━━━━━━
📞 Number: ${config.ownerNumber}
🎮 Name: SIMON TECH
🚀 Status: Active
💎 Premium: Yes`;
                        await sock.sendMessage(from, { text: ownerText });
                    }

                    // Unknown command
                    else {
                        await sock.sendMessage(from, { text: `❌ Command "${cmd}" not found. Type ${config.prefix}menu for all commands.` });
                    }
                }

                // Auto reply (optional)
                if (process.env.ENABLE_AUTO_REPLY === 'true') {
                    if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
                        await sock.sendMessage(from, { text: '👋 Hello! How can I help you?' });
                    }
                }

            } catch (error) {
                console.error('Error handling message:', error);
            }
        });

        // Handle groups
        sock.ev.on('groups.update', (groupUpdates) => {
            for (const group of groupUpdates) {
                console.log(`\n📢 Group update: ${group.subject} (${group.id})`);
            }
        });

    } catch (error) {
        console.error('❌ Error starting bot:', error);
        setTimeout(() => startBot(), 3000);
    }
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Bot shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n👋 Bot shutting down gracefully...');
    process.exit(0);
});

// Start the bot
console.log('═══════════════════════════════════');
console.log('🚀 SIMON-TECH-BOT v' + config.botVersion);
console.log('═══════════════════════════════════\n');

if (!process.env.SESSION_ID) {
    console.log('⚠️  No SESSION_ID found!');
    console.log('📱 Run: npm run session');
    console.log('🔗 Then generate your SESSION_ID and add it to .env\n');
}

startBot().catch(console.error);

module.exports = { startBot, config };