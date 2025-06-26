require('dotenv').config();
const { Client, Intents } = require('discord.js');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === '!ping') {
    message.reply('🏓 Pong!');
  }
});

client.login(process.env.DISCORD_TOKEN);
const { Rcon } = require('rcon-client');
const wol = require('wakeonlan');
const http = require('http');
require('dotenv').config();
const net = require('net');

// --- Configuration ---
const RCON_HOST = process.env.RCON_HOST;
const RCON_PORT = 25575;
const RCON_PASSWORD = process.env.RCON_PASSWORD;
const MAC_ADDRESS = '4c:cc:6a:fc:83:b0';
const BROADCAST_IP = '192.168.7.255';
const WOL_PORT = 9;
const BOT_TOKEN = process.env.DISCORD_TOKEN;

let cooldown = false;


client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// --- Message Handler ---
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  if (content === '!test') {
    return message.reply('Go fuck yourself.');
  }

  if (content === '!help') {
    return message.reply(`📖 **Available Commands:**
• !startserver – Wake up the Minecraft server
• !status – Check if the server is online
• !whitelist add <user>
• !whitelist remove <user>
• !whitelist list
• !rcon <command>
• !restartserver`);
  }

  // --- RCON command ---
  if (content.startsWith('!rcon')) {
    if (!message.member.roles.cache.some(role => ['Web Wresteler'].includes(role.name))) {
      return message.reply('Fuck off, you don’t have permission.');
    }

    const command = message.content.slice(6).trim();
    if (!command) return message.reply('Please provide a console command to run. Example: `!rcon say Hello from Discord!`');

    try {
      const rcon = await Rcon.connect({ host: RCON_HOST, port: RCON_PORT, password: RCON_PASSWORD });
      const response = await rcon.send(command);
      await rcon.end();
      return message.reply(`🛠️ Command sent: \`${command}\`
📥 Response: ${response}`);
    } catch (err) {
      console.error('❌ RCON error:', err);
      message.channel.send(`❌ RCON error: ${err.message}`);
    }
  }

  // --- !status ---
  if (content === '!status') {
    const socket = new net.Socket();
    socket.setTimeout(2000);

    socket.on('connect', () => {
      message.channel.send('🥶 Server is ONLINE and reachable.');
      socket.destroy();
    }).on('timeout', () => {
      message.channel.send('😬 It timed out, dont know if its up ngl. ');
      socket.destroy();
    }).on('error', () => {
      message.channel.send('🥵 Server appears to be OFFLINE.');
    }).connect(25565, RCON_HOST);
  }

  // --- !whitelist list ---
  if (content === '!whitelist list') {
    try {
      const rcon = await Rcon.connect({ host: RCON_HOST, port: RCON_PORT, password: RCON_PASSWORD });
      const response = await rcon.send(`whitelist list`);
      await rcon.end();
      message.channel.send(`Whitelisted users: ${response}`);
    } catch (err) {
      console.error('RCON error:', err);
      message.channel.send(' lol, I forgot how to do that :P');
    }
  }

  // --- !whitelist add <name> ---
  if (content.startsWith('!whitelist add')) {
    const args = message.content.split(' ');
    const username = args[2];
    if (!username) return message.reply('❌ Please provide a username. Example: `!whitelist add josue`');

    try {
      const rcon = await Rcon.connect({ host: RCON_HOST, port: RCON_PORT, password: RCON_PASSWORD });
      const response = await rcon.send(`whitelist add ${username}`);
      await rcon.end();
      message.reply(`Added \`${username}\` to the whitelist.\nMinecraft says: ${response}`);
    } catch (err) {
      console.error('RCON error:', err);
      message.channel.send('❌ Man, I fucked up. Failed to add user to whitelist.');
    }
  }

  // --- !whitelist remove <name> ---
  if (content.startsWith('!whitelist remove')) {
    if (!message.member.roles.cache.some(role => ['Owner', 'Web Wresteler'].includes(role.name))) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const args = message.content.split(' ');
    const username = args[2];
    if (!username) return message.reply('❌ Please provide a username. Example: `!whitelist remove Steve`');

    try {
      const rcon = await Rcon.connect({ host: RCON_HOST, port: RCON_PORT, password: RCON_PASSWORD });
      const response = await rcon.send(`whitelist remove ${username}`);
      await rcon.end();
      message.channel.send(`✅ Removed \`${username}\` from the whitelist.\nMinecraft says: ${response}`);
    } catch (err) {
      console.error('RCON error:', err);
      message.channel.send('❌ Failed to remove user from whitelist.');
    }
  }

  // --- !startserver ---
  if (content === '!startserver') {
    if (cooldown) {
      message.channel.send("Hold your fucking horses, I'm starting the server already.");

      setTimeout(() => {
        message.reply("Punk ass hoe.");
      }, 3000);

      setTimeout(() => {
        message.channel.send("Making my job all HAAARD and shit.");
      }, 6000);

      return;
    }

    cooldown = true;
    setTimeout(() => cooldown = false, 60 * 1000);

    wol(MAC_ADDRESS, { address: BROADCAST_IP, port: WOL_PORT })
      .then(() => {
        const responses = [
          { text: " ✅ WOL signal sent! The server should be waking up. Checking for server response.", weight: 5 },
          { text: " ✅ Attempting to boot the server up! Checking for server response.", weight: 5 },
          { text: " ✅ Server should be up soon. Checking for server response.", weight: 5 },
          { text: " Type shit! Attempting to boot server now.", weight: 3 },
          { text: " 🌚 THANK YOUU I LOVE BOOTING SERVERS! THATS MY ONE PURPOSE IN LIFE!!! NOTHING MAKES ME HAPPIER THAN TO CHECK FOR A SERVER RESPONSE!!!!", weight: 2 },
          { text: " Hold on lemme boot that shit up!!", weight: 3 },
          { text: " 🫃", weight: 1 },
          { text: " Shut up dickhead.", weight: 1 }
        ];
        const weightedPool = responses.flatMap(r => Array(r.weight).fill(r.text));
        const randomReply = weightedPool[Math.floor(Math.random() * weightedPool.length)];

        message.channel.send(randomReply);

        let elapsedTime = 0;
        const maxTime = 180;

        const interval = setInterval(() => {
          const socket = new net.Socket();
          socket.setTimeout(1000);

          socket.on('connect', () => {
            message.channel.send('🥶 Server is now online! You can join.');
            socket.destroy();
            clearInterval(interval);
          }).on('timeout', () => {
            socket.destroy();
          }).on('error', () => {
            socket.destroy();
          }).connect(25565, RCON_HOST);

          elapsedTime++;
          if (elapsedTime >= maxTime) {
            clearInterval(interval);
            message.channel.send('🥵😢 Server did not come online within 1 minute, try again or tell George.');
          }
        }, 1000);
      })
      .catch(err => {
        console.error(err);
        message.channel.send('❌ Failed to send WOL packet.');
      });
  }
});

// --- Start bot ---
client.login(BOT_TOKEN);
