import * as Discord from 'discord.js';
import { RateSpeechesClient } from './rate-speeches-client';
import { GoogleTranslator } from './google-translator';

require('dotenv').config();

const discordSecret = process.env.DISCORD_SECRET;
const googleProjectId = process.env.GOOGLE_PROJECT_ID!;

const googleTranslator = new GoogleTranslator(googleProjectId);
const rateSpeechesClient = new RateSpeechesClient();
const discord = new Discord.Client();

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
  if (message.content === 'help') {
    return message.reply(`${greeting} ${helpMessage}`);
  }
  if (/roll|ролл|hi/i.test(message.content)) {
    await message.channel.startTyping();
    const topics = await rateSpeechesClient.getRandomTopics();
    const translations = await Promise.all(topics.map(topic => {
      return googleTranslator.translate(topic);
    }));
    const messages = topics.reduce((string, topic, i) => {
      return `${string}\n${topic} | ${translations[i]}`;
    }, '');
    await message.reply(messages);
    await message.channel.stopTyping();
  } else if (message.content) {
    await message.reply(`Не могу распознать команду. ${helpMessage}`)
  }
});

discord.on('error', async error => {
  console.error(error);
});

discord.login(discordSecret);
