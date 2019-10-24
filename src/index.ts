import * as Discord from 'discord.js';
import { RateSpeechesClient } from './rate-speeches-client';
import { GoogleTranslator } from './google-translator';
import { formatMessage } from './format-message';
import axios from 'axios';
import { Analytics } from './analytics';
import * as createDashbot from 'dashbot';
const { TranslationServiceClient } = require('@google-cloud/translate').v3beta1;

require('dotenv').config();

const discordSecret = process.env.DISCORD_SECRET;
const googleProjectId = process.env.GOOGLE_PROJECT_ID!;
const dashbotApiToken = process.env.DASHBOT_API_TOKEN!;

const googleTranslator = new GoogleTranslator(new TranslationServiceClient(), googleProjectId);
const rateSpeechesClient = new RateSpeechesClient(axios.create());
const discord = new Discord.Client();
const analytics = new Analytics(createDashbot(dashbotApiToken).universal);

const greeting = `Привет, я могу брать темы для обсуждения с сайта ratespeeches.com и прогонять их через Гугл-переводчик.`;
const helpMessage = `\n\nДоступные команды:\n\`roll\` или \`ролл\` - запросить список случайных тем\n\`help\` - помощь`;

discord.on('message', async (message: Discord.Message) => {
  const directMessage = 'dm';
  if (message.author.bot || message.channel.type !== directMessage) {
    return;
  }
  analytics.trackUserMessage(message.author.id, message.content);
  if (message.content === 'help') {
    const outgoingMessage = `${greeting} ${helpMessage}`;
    await Promise.all([
      message.reply(outgoingMessage),
      analytics.trackBotMessage(message.author.id, outgoingMessage)
    ]);
    return;
  }
  if (/roll|ролл|hi/i.test(message.content)) {
    await message.channel.startTyping();
    const topics = await rateSpeechesClient.getRandomTopics();
    const translations = await Promise.all(topics.map(topic => googleTranslator.translate(topic)));
    const messages = formatMessage(topics, translations);
    await message.reply(messages);
    await analytics.trackBotMessage(message.author.id, messages);
  } else if (message.content) {
    const outgoingMessage = `Не могу распознать команду. ${helpMessage}`;
    await Promise.all([
      message.reply(outgoingMessage),
      analytics.trackBotMessage(message.author.id, outgoingMessage)
    ]);
  }
  message.channel.stopTyping();
});

discord.on('ready', () => {
  console.log(`Logged in as ${discord.user.tag}!`);
});

discord.on('error', error => {
  console.error(error);
});

discord.login(discordSecret);
