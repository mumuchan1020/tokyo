'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const line = require('@line/bot-sdk');

// 從環境變量中創建LINE SDK配置
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
};

// 創建LINE SDK客戶端
const client = new line.Client(config);

// 創建Express應用
// 關於Express本身的更多信息: https://expressjs.com/
const app = express();

// 使用中介軟體註冊Webhook處理程序
// 關於中介軟體的更多信息，請參閱文檔
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// 事件處理函數
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // 忽略非簡訊事件
    return Promise.resolve(null);
  }

  // 將消息內容轉換為小寫
  const message = event.message.text.toLowerCase();
  let commandUrl = '';

  // 根據消息內容構建Arduino控制URL
  if (message.includes('turn on 16')) {
    commandUrl = 'http://<arduino-ip-address>/16/on';
  } else if (message.includes('turn off 16')) {
    commandUrl = 'http://<arduino-ip-address>/16/off';
  } else if (message.includes('turn on 17')) {
    commandUrl = 'http://<arduino-ip-address>/17/on';
  } else if (message.includes('turn off 17')) {
    commandUrl = 'http://<arduino-ip-address>/17/off';
  }

  // 如果commandUrl不為空，發送請求到Arduino
  if (commandUrl) {
    try {
      await axios.get(commandUrl);
      // 回復用戶，命令已發送到Arduino
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `命令已發送到Arduino: ${message}`
      });
    } catch (error) {
      console.error('發送命令到Arduino時出錯:', error);
      // 回復用戶，發送命令失敗
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `發送命令到Arduino失敗: ${message}`
      });
    }
  } else {
    // 回復用戶，無效的命令
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: `無效的命令: ${message}`
    });
  }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
