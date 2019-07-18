import * as Discord from 'discord.js';
import { RateSpeechesClient } from './rate-speeches-client';
import { GoogleTranslator } from './google-translator';
import { formatMessage } from './format-message';
const createDashbot = require('dashbot');

require('dotenv').config();

const discordSecret = process.env.DISCORD_SECRET;
const googleProjectId = process.env.GOOGLE_PROJECT_ID!;
const dashbotApiToken = process.env.DASHBOT_API_TOKEN!;

const googleTranslator = new GoogleTranslator(googleProjectId);
const rateSpeechesClient = new RateSpeechesClient();
const discord = new Discord.Client();
const dashbot = createDashbot(dashbotApiToken).universal;

const greeting = 'Привет, я могу брать темы для обсуждения с сайта ratespeeches.com и прогонять их через Гугл-переводчик.';
const helpMessage = `\n\nДоступные команды:\n\`roll\` или \`ролл\` - запросить список случайных тем\n\`help\` - помощь`;

discord.on('ready', () => {
  console.log(`Logged in as ${discord.user.tag}!`);
});

// @ts-ignore
discord.on('message', async (message: Discord.Message) => {
  const directMessage = 'dm';
  if (message.author.bot || message.channel.type !== directMessage) {
    return;
  }
  dashbot.logIncoming({ text: message.content, userId: message.author.id });
  if (message.content === 'help') {
    const outgoingMessage = `${greeting} ${helpMessage}`;
    return Promise.all([
      message.reply(outgoingMessage),
      dashbot.logOutgoing({ text: outgoingMessage, userId: message.author.id })
    ]);
  }
  if (/roll|ролл|hi/i.test(message.content)) {
    await message.channel.startTyping();
    const topics = await rateSpeechesClient.getRandomTopics();
    const translations = await Promise.all(topics.map(topic => {
      return googleTranslator.translate(topic);
    }));
    const messages = formatMessage(topics, translations);
    await message.reply(messages);
    await Promise.all([
      message.channel.stopTyping(),
      dashbot.logOutgoing({ text: messages, userId: message.author.id })
    ]);
  } else if (message.content) {
    const outgoingMessage = `Не могу распознать команду. ${helpMessage}`;
    await Promise.all([
      message.reply(outgoingMessage),
      dashbot.logOutgoing({ text: outgoingMessage, userId: message.author.id })
    ]);
  }
});

discord.on('error', error => {
  console.error(error);
});

discord.login(discordSecret);
