'use strict';

const express = require('express');
const axios = require('axios');
const line = require('@line/bot-sdk');

// 從環境變量中創建 LINE SDK 配置
const config = {
  channelSecret: 4de7804ae152020565d1a8546e5636ae
  channelAccessToken: ytyib3TUCBV/AuVT5z4HI71GfH8uxDvltNsQjM4+K4oRd4wSoneE5KgHTFsfgzGG21d3aLJs+fKzNhF63D8rFwwEaC+S6tybH6vvnKXQQIZCUdDV/mL5dBcAmjNrmhoC3fDhSJFq1qnMhi9My8Bx7gdB04t89/1O/w1cDnyilFU=
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
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// 新增處理來自 Arduino 的消息的端點
app.post('/send-message', (req, res) => {
  const message = req.body.message;
  if (message) {
    // 向 LINE Bot 用戶發送消息
    client.pushMessage('<U5f4d73e618b7bdfb0cb796dd4458dbb1>', { // 替換為您 LINE Bot 用戶的 ID
      type: 'text',
      text: message
    })
    .then(() => {
      res.status(200).json({ status: 'Message sent' });
    })
    .catch((err) => {
      console.error(err);
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
    commandUrl = 'http://<192.168.11.5>/16/on'; // 控制設備打開
  } else if (message === '0' || message === 'b') {
    commandUrl = 'http://<192.168.11.5>/16/off'; // 控制設備關閉
  } else if (message === '2' || message === 'c') {
    commandUrl = 'http://<192.168.11.5>/17/on'; // 控制設備打開
  } else if (message === '3' || message === 'd') {
    commandUrl = 'http://<192.168.11.5>/17/off'; // 控制設備關閉
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
