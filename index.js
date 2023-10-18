import { Client, Events, GatewayIntentBits } from 'discord.js';
import GetDataByBranch from './github_api.js';
import config from "./config.json" assert {type: 'json'};

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, client => {
  console.log(`Bot started! ${client.user.tag}`);
  const channel = client.channels.cache.get(config.channelId)
  setInterval(async () => {
    await GetDataByBranch(channel);
  }, 1000)
})

client.login(config.discordToken);