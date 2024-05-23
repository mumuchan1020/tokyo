'use strict';

const express = require('express');
const axios = require('axios');
const line = require('@line/bot-sdk');

// 從環境變量中創建 LINE SDK 配置
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};

// 創建 LINE SDK 客戶端
const client = new line.Client(config);

// 創建 Express 應用程式
const app = express();
app.use(express.json()); // 增加 JSON 解析中間件

// 使用中介軟件註冊 Webhook 處理程序
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => {
      res.status(200).json(result); // 确保返回 200 状态码
    })
    .catch((err) => {
      console.error('Error handling event:', err);
      res.status(500).json({ error: 'Failed to handle event' }); // 返回详细错误信息
    });
});

// 新增處理來自 Arduino 的消息的端點
app.post('/send-message', (req, res) => {
  const message = req.body.message;
  if (message) {
    // 向 LINE Bot 用戶發送消息
    client.pushMessage('U5f4d73e618b7bdfb0cb796dd4458dbb1', { // 替換為您 LINE Bot 用戶的 ID
      type: 'text',
      text: message
    })
    .then(() => {
      res.status(200).json({ status: 'Message sent' });
    })
    .catch((err) => {
      console.error('Failed to send message:', err);
      res.status(500).json({ status: 'Failed to send message', error: err });
    });
  } else {
    res.status(400).json({ status: 'No message provided' });
  }
});

// 事件處理函數
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // 忽略非文本消息事件
    return Promise.resolve(null);
  }

  // 將消息內容轉換為小寫
  const message = event.message.text.toLowerCase();
  let commandUrl = '';

  // 根據消息內容構建 Arduino 控制 URL
  if (message === '1' || message === 'a') {
    commandUrl = 'http://<arduino-ip-address>/16/on'; // 控制設備打開
  } else if (message === '0' || message === 'b') {
    commandUrl = 'http://<arduino-ip-address>/16/off'; // 控制設備關閉
  } else if (message === '2' || message === 'c') {
    commandUrl = 'http://<arduino-ip-address>/17/on'; // 控制設備打開
  } else if (message === '3' || message === 'd') {
    commandUrl = 'http://<arduino-ip-address>/17/off'; // 控制設備關閉
  }

  // 如果 commandUrl 不為空，發送請求到 Arduino
  if (commandUrl) {
    try {
      await axios.get(commandUrl);
      // 回覆用戶，命令已發送到 Arduino
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `命令已發送到 Arduino: ${message}`
      });
    } catch (error) {
      console.error('發送命令到 Arduino 時出錯:', error);
      // 回覆用戶，發送命令失敗
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `發送命令到 Arduino 失敗: ${message}`
      });
    }
  } else {
    // 回覆用戶，無效的命令
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: `無效的命令: ${message}`
    });
  }
}

// 監聽端口
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`正在監聽端口 ${port}`);
});
