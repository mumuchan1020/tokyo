const crypto = require('crypto');

// 用于验证签名的 Channel Secret
const channelSecret = 'YOUR_CHANNEL_SECRET';

// 验证签名的函数
function validateSignature(signature, requestBody) {
    const hash = crypto.createHmac('sha256', channelSecret)
                       .update(requestBody)
                       .digest('base64');
    
    return signature === hash;
}

// Express 中间件，用于验证签名
function verifySignatureMiddleware(req, res, next) {
    const signature = req.headers['x-line-signature'];
    const requestBody = JSON.stringify(req.body);
    
    if (!signature) {
        return res.status(400).json({ error: 'No signature provided' });
    }
    
    if (!validateSignature(signature, requestBody)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }
    
    next(); // 签名验证通过，继续处理请求
}

// 在 Express 应用中使用中间件
const express = require('express');
const app = express();

app.use(express.json());
app.use(verifySignatureMiddleware);

// 处理 LINE 平台发送的 POST 请求
app.post('/webhook', (req, res) => {
    // 处理接收到的消息
    console.log('Received message:', req.body);
    
    // 响应 200 OK
    res.status(200).end();
});

// 启动 Express 服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
