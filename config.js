// Bot Configuration
module.exports = {
    // Bot Settings
    botName: process.env.BOT_NAME || 'SIMON',
    prefix: process.env.BOT_PREFIX || '.',
    version: process.env.BOT_VERSION || '1.0.3',
    mode: process.env.BOT_MODE || 'private',
    
    // Owner Settings
    ownerNumber: process.env.OWNER_NUMBER || '2349166265317',
    ownerName: process.env.OWNER_NAME || 'SIMON TECH',
    
    // Session
    sessionName: 'SIMON',
    sessionPath: './sessions',
    
    // Features
    features: {
        ai: process.env.ENABLE_AI === 'true',
        games: process.env.ENABLE_GAMES === 'true',
        economy: process.env.ENABLE_ECONOMY === 'true',
        security: process.env.ENABLE_SECURITY === 'true',
        autoReply: process.env.ENABLE_AUTO_REPLY === 'true'
    },
    
    // Auto Features
    autoFeatures: {
        readStatus: process.env.AUTO_READ_STATUS === 'true',
        readMessages: process.env.AUTO_READ_MESSAGES === 'true',
        typing: process.env.AUTO_TYPING === 'true',
        recording: process.env.AUTO_RECORDING === 'true',
        react: process.env.AUTO_REACT === 'true'
    },
    
    // Security
    security: {
        antilink: process.env.ANTILINK === 'true',
        antispam: process.env.ANTISPAM === 'true',
        antibot: process.env.ANTIBOT === 'true',
        antifake: process.env.ANTIFAKE === 'true'
    },
    
    // API Keys
    apis: {
        openai: process.env.OPENAI_API_KEY || '',
        rapidapi: process.env.RAPIDAPI_KEY || '',
        youtube: process.env.YOUTUBE_API_KEY || ''
    },
    
    // Database
    database: {
        uri: process.env.MONGODB_URI || '',
        name: process.env.DB_NAME || 'simon_bot'
    },
    
    // Server
    port: process.env.PORT || 3000,
    debug: process.env.DEBUG === 'true',
    logLevel: process.env.LOG_LEVEL || 'info',
    nodeEnv: process.env.NODE_ENV || 'development'
};