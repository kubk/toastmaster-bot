require('dotenv').config();

const Discord = require('discord.js');
const YandexTranslator = require('./yandex-translator');
const ToastmasterClient = require('./toastmaster-client');

const discordSecret = process.env.DISCORD_SECRET;
const yandexApiKey = process.env.YANDEX_API_KEY;

const yandexTranslator = new YandexTranslator(yandexApiKey);
const toastmasterClient = new ToastmasterClient();
const discord = new Discord.Client();

const greeting = 'Привет, я могу брать темы для обсуждения с сайта ratespeeches.com и прогонять их через Яндекс-переводчик.';
const helpMessage = `Доступные команды:\n\`roll\` или \`ролл\` - Запросить список случайных тем\n\`help\` - Помощь`;

discord.on('ready', () => {
  console.log(`Logged in as ${discord.user.tag}!`);
});

discord.on('message', async message => {
  const directMessage = 'dm';
  if (message.author.bot || message.channel.type !== directMessage) {
    return;
  }
  if (message.content === 'help') {
    return message.reply(`${greeting} ${helpMessage}`);
  }
  if (/roll|ролл|hi/i.test(message.content)) {
    await message.channel.startTyping();
    const topics = await toastmasterClient.getRandomTopics();
    const messages = await Promise.all(topics.map(async topic => {
      const translation = await yandexTranslator.translate(topic);
      return `${topic} | ${translation}`;
    }));
    await message.reply(messages.join('\n'));
    await message.channel.stopTyping();
  } else if (message.content) {
    await message.reply(`Не могу распознать команду. ${helpMessage}`)
  }
});

discord.on('error', async message => {
  await message.channel.stopTyping();
});

discord.login(discordSecret);
