const crypto = require('crypto');
const axios = require('axios');
const express = require('express');
const app = express();

// 用於驗證簽名的 Channel Secret
const channelSecret = '4de7804ae152020565d1a8546e5636ae';

// Arduino 的 IP 地址
const arduinoIPAddress = '192.168.11.5';

// 驗證簽名的函數
function validateSignature(signature, requestBody) {
    const hash = crypto.createHmac('sha256', channelSecret)
                       .update(requestBody)
                       .digest('base64');
    
    return signature === hash;
}

// Express 中間件，用於驗證簽名
function verifySignatureMiddleware(req, res, next) {
    const signature = req.headers['x-line-signature'];
    const requestBody = JSON.stringify(req.body);
    
    if (!signature) {
        return res.status(400).json({ error: 'No signature provided' });
    }
    
    if (!validateSignature(signature, requestBody)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }
    
    next(); // 簽名驗證通過，繼續處理請求
}

app.use(express.json());
app.use(verifySignatureMiddleware);

// 處理 LINE 平台發送的 POST 請求
app.post('/webhook', (req, res) => {
    if (req.body && req.body.events && req.body.events.length > 0 && req.body.events[0].message) {
        const receivedMessage = req.body.events[0].message.text.toLowerCase();
        console.log('Received message:', receivedMessage);
        
        // 控制 Arduino
        let commandUrl = '';
        if (receivedMessage === '1' || receivedMessage === 'a') {
            commandUrl = `http://http://120.96.67.16/16/on`; // 控制設備打開
          console.log('aa command sent success ---');
          console.log(commandUrl);
        } else if (receivedMessage === '0' || receivedMessage === 'b') {
            commandUrl = `http://http://120.96.67.16/16/off`; // 控制設備關閉
        } else if (receivedMessage === '2' || receivedMessage === 'c') {
            commandUrl = `http://192.168.11.5/17/on`; // 控制設備打開
        } else if (receivedMessage === '3' || receivedMessage === 'd') {
            commandUrl = `http://192.168.11.5/17/off`; // 控制設備關閉
        }
        
        if (commandUrl) {
            axios.get(commandUrl)
                .then(response => {
                    console.log('Arduino command sent successfully');
                })
                .catch(error => {
                    console.error('Failed to send command to Arduino:', error);
                });
        }
    } else {
        console.error('Invalid request format, missing message property');
    }
    
    // 回應 200 OK
    res.status(200).end();
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
