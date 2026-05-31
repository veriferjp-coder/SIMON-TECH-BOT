const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

let qrCodeData = null;
let sessionGenerated = false;
let sessionId = null;

// Ensure sessions directory exists
const sessionsDir = path.join(__dirname, 'sessions');
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir, { recursive: true });
}

async function generateSession() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(path.join(sessionsDir, 'SIMON'));

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        qrCodeData = qr;
        sessionGenerated = false;
        console.log('QR Code generated. Scan it with your WhatsApp app.');
      }

      if (connection === 'open') {
        sessionGenerated = true;
        sessionId = 'SIMON'; // Session ID is the folder name
        console.log('✅ Session generated successfully!');
        console.log(`📱 Session ID: ${sessionId}`);

        // Generate SESSION_ID string
        const credentialsPath = path.join(sessionsDir, 'SIMON', 'creds.json');
        if (fs.existsSync(credentialsPath)) {
          const credentials = JSON.stringify(require(credentialsPath));
          const encodedSession = Buffer.from(credentials).toString('base64');
          sessionId = encodedSession;
          console.log(`\n🔐 Your SESSION_ID:\n${sessionId}\n`);
        }
      }

      if (connection === 'close') {
        const shouldReconnect =
          lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log(
          'connection closed due to ',
          lastDisconnect?.error,
          ', reconnecting ',
          shouldReconnect
        );
        if (shouldReconnect) {
          generateSession();
        }
      }
    });

    sock.ev.on('creds.update', saveCreds);

  } catch (error) {
    console.error('Error generating session:', error);
  }
}

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SIMON-TECH-BOT - Session Generator</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 15px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          max-width: 600px;
          width: 100%;
          padding: 40px;
          text-align: center;
        }
        h1 {
          color: #333;
          margin-bottom: 10px;
          font-size: 28px;
        }
        .subtitle {
          color: #666;
          margin-bottom: 30px;
          font-size: 14px;
        }
        .qr-container {
          margin: 30px 0;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
          display: none;
        }
        .qr-container.active {
          display: block;
        }
        #qrCode {
          max-width: 300px;
          width: 100%;
          margin: 0 auto;
        }
        .button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin: 10px 5px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        .session-display {
          margin: 20px 0;
          padding: 15px;
          background: #f0f4ff;
          border-radius: 8px;
          display: none;
          word-break: break-all;
          max-height: 200px;
          overflow-y: auto;
          text-align: left;
          border: 2px solid #667eea;
        }
        .session-display.active {
          display: block;
        }
        .copy-btn {
          background: #28a745;
          margin-top: 10px;
        }
        .copy-btn:hover {
          box-shadow: 0 10px 20px rgba(40, 167, 69, 0.3);
        }
        .status {
          padding: 10px;
          border-radius: 5px;
          margin: 15px 0;
          display: none;
          font-weight: bold;
        }
        .status.active {
          display: block;
        }
        .status.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        .status.waiting {
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        }
        .info {
          background: #e7f3ff;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          font-size: 14px;
          color: #004085;
          border-left: 4px solid #004085;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🤖 SIMON-TECH-BOT</h1>
        <p class="subtitle">WhatsApp Session Generator</p>
        
        <div class="info">
          <strong>ℹ️ Instructions:</strong><br>
          1. Click "Generate QR Code" below<br>
          2. Scan the QR code with your WhatsApp phone<br>
          3. Wait for session to generate<br>
          4. Copy your SESSION_ID<br>
          5. Use it in your bot configuration
        </div>

        <button class="button" onclick="generateQR()">🔄 Generate QR Code</button>
        
        <div id="status" class="status"></div>
        
        <div class="qr-container" id="qrContainer">
          <p style="color: #666; margin-bottom: 15px;">Scan this QR code with your WhatsApp:</p>
          <div id="qrCode"></div>
          <p style="color: #999; font-size: 12px; margin-top: 10px;">QR expires in 60 seconds</p>
        </div>

        <div class="session-display" id="sessionDisplay">
          <strong>✅ Session ID Generated!</strong><br><br>
          <code id="sessionId"></code>
        </div>

        <button class="button copy-btn" id="copyBtn" onclick="copySession()" style="display: none;">📋 Copy SESSION_ID</button>
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode.js/1.5.3/qrcode.min.js"></script>
      <script>
        async function generateQR() {
          const status = document.getElementById('status');
          const qrContainer = document.getElementById('qrContainer');
          const sessionDisplay = document.getElementById('sessionDisplay');
          const copyBtn = document.getElementById('copyBtn');

          status.textContent = '⏳ Generating QR Code...';
          status.className = 'status active waiting';
          qrContainer.classList.remove('active');
          sessionDisplay.classList.remove('active');
          copyBtn.style.display = 'none';

          try {
            const response = await fetch('/generate-qr');
            const data = await response.json();

            if (data.qr) {
              document.getElementById('qrCode').innerHTML = '';
              new QRCode(document.getElementById('qrCode'), data.qr);
              qrContainer.classList.add('active');
              status.textContent = '📱 Scan the QR code with your WhatsApp phone';
              status.className = 'status active waiting';

              // Check for session every 2 seconds
              checkSession();
            }
          } catch (error) {
            status.textContent = '❌ Error: ' + error.message;
            status.className = 'status active';
            status.style.background = '#f8d7da';
            status.style.color = '#721c24';
          }
        }

        async function checkSession() {
          try {
            const response = await fetch('/check-session');
            const data = await response.json();

            if (data.sessionGenerated) {
              const status = document.getElementById('status');
              const sessionDisplay = document.getElementById('sessionDisplay');
              const copyBtn = document.getElementById('copyBtn');

              document.getElementById('sessionId').textContent = data.sessionId;
              sessionDisplay.classList.add('active');
              copyBtn.style.display = 'inline-block';
              
              status.textContent = '✅ Session generated successfully!';
              status.className = 'status active success';
              
              document.getElementById('qrContainer').classList.remove('active');
            } else {
              setTimeout(checkSession, 2000);
            }
          } catch (error) {
            console.log('Checking session...');
            setTimeout(checkSession, 2000);
          }
        }

        function copySession() {
          const sessionText = document.getElementById('sessionId').textContent;
          navigator.clipboard.writeText(sessionText).then(() => {
            alert('✅ SESSION_ID copied to clipboard!');
          });
        }
      </script>
    </body>
    </html>
  `);
});

app.get('/generate-qr', (req, res) => {
  if (qrCodeData) {
    res.json({ qr: qrCodeData });
  } else {
    generateSession();
    res.json({ message: 'Generating QR code...' });
  }
});

app.get('/check-session', (req, res) => {
  res.json({ sessionGenerated, sessionId });
});

app.listen(PORT, () => {
  console.log(`🚀 Session Generator running on http://localhost:${PORT}`);
  console.log(`📱 Open this link in your browser to generate your SESSION_ID`);
});
