require('dotenv').config();
const express = require('express');
const app = express();
const Telegram = require('telegraf/telegram');
const telegram = new Telegram(process.env.BOT_TOKEN, {
  agent: null, // https.Agent instance, allows custom proxy, certificate, keep alive, etc.
  webhookReply: true,
});
app.use(express.json());

app.post('/contact', (req, res) => {
  telegram.sendMessage(
    process.env.SHEERLIN_ID,
    ` name: ${req.body.name}
    subject: ${req.body.subject}
  contact: ${req.body.contact}
  message: ${req.body.message}`,
  );

  res.send('ok');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
