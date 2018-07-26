require('dotenv').config();
const express = require('express');
const app = express();
const Telegram = require('telegraf/telegram');
const telegram = new Telegram(process.env.BOT_TOKEN, {
  agent: null, // https.Agent instance, allows custom proxy, certificate, keep alive, etc.
  webhookReply: true,
});
const fetch = require('node-fetch');

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.post('/contact', async (req, res) => {
  if (!req.body.gToken || req.body.gToken === '') {
    res.status(400);
    return res.send({ message: 'Missing reCaptcha token' });
  }
  const { URLSearchParams } = require('url');
  const url = 'https://www.google.com/recaptcha/api/siteverify';

  const params = new URLSearchParams();
  params.append('secret', process.env.SECRET_KEY);
  params.append('response', req.body.gToken);
  const response = await fetch(url, {
    method: 'POST',
    body: params,
  }).then(res => res.json());

  if (!response.success) {
    res.status(400);
    return res.send({ message: 'Recaptcha Invalid' });
  }

  telegram.sendMessage(
    process.env.SHEERLIN_ID,
    `
    name: ${req.body.name}
    email: ${req.body.email}
    message: ${req.body.message}
    `,
  );
  res.send('ok');
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));

//subject: ${req.body.subject}
