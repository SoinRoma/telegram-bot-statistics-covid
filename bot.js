require('dotenv').config();
const {Telegraf} = require('telegraf')
const api = require('covid19-api');
const COUNTRIES_LIST = require('./countries');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply(`Приветсвую тебя ${ctx.message.from.first_name}. Узнай статистику по COVID 19. Введи название страны и узнай статистику!`);
    ctx.reply(`Полный список стран можно посмотреть через команду /help`);
});

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
    let data = {};
    try {
        data = await api.getReportsByCountries(ctx.message.text);
        const formatData = `Страна: ${data[0][0].country}\nСлучаи: ${data[0][0].cases}\nСмертей: ${data[0][0].deaths}\nВылечились: ${data[0][0].recovered}`;
        ctx.reply(formatData);
    } catch (e) {
        ctx.reply('Наверное вы ошиблись. Введите страну заново! Или посмотрите список всех стра /help')
    }
});

bot.launch();


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
