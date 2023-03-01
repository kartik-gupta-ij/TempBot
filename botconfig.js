const Subscribers = require('./models/subscribers');
const dotenv = require('dotenv');
const request = require('request');
const TelegramBot = require('node-telegram-bot-api');

function funBot(req, res, next) {
  dotenv.config();

  const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=${process.env.WEATHER_API_KEY}&units=metric`
  const telegramBotToken = process.env.BOT_TOKEN
  console.log(telegramBotToken)
  const bot = new TelegramBot(telegramBotToken, { polling: true });


  bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Welcome to my Telegram bot!
Use the /subscribe command to subscribe to temperature updates.
Use the /unsubscribe command to unsubscribe.
Use the /currenttemp command to check the current temperature in Delhi.
Use the /Nsubscribers command to see the list of subscribed users.
    `);
    console.log("/start")
  });

  bot.onText(/\/subscribe/, (msg) => {
    Subscribers.findOne({ chatId: msg.chat.id }, (err, subscriber) => {
      if (err) throw err;
      if (subscriber === null) {
        Subscribers.create({
          chatId: msg.chat.id,
          firstName: msg.chat.first_name,
          lastName: msg.chat.last_name,
          username: msg.chat.username
        }, (err) => {
          if (err) throw err;
          bot.sendMessage(msg.chat.id, 'You have been subscribed to temperature updates.');
        });
      } else {
        bot.sendMessage(msg.chat.id, 'You are already subscribed to temperature updates.');
      }
    });
    console.log("/subscribe")
  });

  bot.onText(/\/unsubscribe/, (msg) => {
    Subscribers.deleteOne({ chatId: msg.chat.id }, (err) => {
      if (err) throw err;
      bot.sendMessage(msg.chat.id, 'You have been unsubscribed from temperature updates.');
    });
    console.log("/unsubscribe")
  });

  bot.onText(/\/Nsubscribers/, (msg) => {
    Subscribers.find()
      .then((subscribers) => {
        if (subscribers.length === 0) {
          bot.sendMessage(msg.chat.id, 'There are no subscribers.');
        } else {
          let subscribersList = 'List of subscribers:\n';
          subscribers.forEach((subscriber) => {
            subscribersList += `- ${subscriber.firstName} ${subscriber.lastName} (@${subscriber.username}) \n`;
          });
          bot.sendMessage(msg.chat.id, subscribersList);

        }
      }, (err) => next(err))
      .catch((err) => next(err));
    console.log("/Nsubscribers")
  });
  
  bot.onText(/\/currenttemp/, (msg) => {
    request(weatherUrl, (err, res, body) => {
      if (err) throw err;
      const weather = JSON.parse(body);
      const temperature = weather.main.temp;
      bot.sendMessage(msg.chat.id, `The current temperature in Delhi is ${temperature}°C.`);
    });
    console.log("/currenttemp")
  });

  function getTemperature() {
    request("https://telegramtemperaturebot.onrender.com/subscribers", function (err, res, body) {
      if (!err && res.statusCode === 200) {
        const subscribersWeb = JSON.parse(body);
        console.log(subscribersWeb)
      }
    });
    request(weatherUrl, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        const weather = JSON.parse(body);
        const temperature = weather.main.temp;
        const message = `The current temperature in Delhi is${temperature}°C.`;
        Subscribers.find()
        .then((subscribers) => {
          console.log(subscribers)
          subscribers.forEach((subscriber) => {
            bot.sendMessage(subscriber.chatId, message);
          });
        }, (err) => next(err))
        .catch((err) => next(err));
      }
    });
    console.log("getTemperature")
  }
  setInterval(getTemperature, 3600000);
  function keepActive() {
    request("https://telegramtemperaturebot2.onrender.com/subscribers", function (err, res, body) {
      console.log("keepActive")
    });
  }
  setInterval(keepActive, 36000);
}

module.exports = funBot;