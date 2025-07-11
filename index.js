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
const { exec } = require("child_process");
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
const JOSUE_ID = "737173833257189447";
const WOL_PORT = 9;
const BOT_TOKEN = process.env.DISCORD_TOKEN;

function Admin(member) {
  return member.roles.cache.some(role =>
    ['Owner', 'Web Wrestler'].includes(role.name)
  );
}

const express = require('express');
const app = express();
app.use(express.json());
const PORT = 6789; // You can use any unused port you want

// Ping this endpoint from your Ubuntu server to send a Discord message!
app.post('/mc-hibernate', async (req, res) => {
  const channel = client.channels.cache.find(c => c.name === '738523333611618364');
  if (!channel) return res.status(404).send('Channel not found');
  const text = req.body.text || "Nobody is on the server, Im putting her tf to bed. Use !startserver to wake it up again.";
  await channel.send(text);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`HTTP endpoint for hibernate alerts listening on ${PORT}`);
});

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
    return message.reply(` **Available Commands:**
\`\`\`
!startserver            Wakes up the Minecraft server via WOL
!playerslist            Shows who’s currently online
!status                 Checks if the server is online
!test                   Tests if bot is working
!whitelist list         List all whitelisted users
\`\`\`
`);
  }

    if (content === '!ghelp') {
    return message.reply(`
Available Commands:
!startserver      - Wakes up the Minecraft server via WOL
!status           - Checks if the server is online
!test             - Tests if bot is working
!whitelist list   - List all whitelisted users
!backup           - Backs up the Minecraft world
!restart server   - Restarts the Minecraft server
!restart machine  - Reboots the entire system
!shutdown         - Shuts down the server
!sleep            - Suspends the server after backing up
!playerslist      - Shows who’s currently online

`);
  }
  
//playerlist
  if (message.content === '!playerslist') {
  try {
    const rcon = await Rcon.connect({ host: RCON_HOST, port: RCON_PORT, password: RCON_PASSWORD });
    const res = await rcon.send('list');
    await rcon.end();
    message.reply(`🧍 Online players:\n\`\`\`\n${res}\n\`\`\``);
  } catch (err) {
    console.error(err);
    message.reply("Couldn't get player list. Kinda Tweaking rn.");
  }
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
  const host = RCON_HOST;
  const port = 25565;
  const socket = new net.Socket();
  socket.setTimeout(2000);

  socket.on('connect', () => {
    message.channel.send('🥶 Server is ONLINE and reachable.');
    socket.destroy();
  }).on('timeout', () => {
    message.channel.send('😬 It timed out, dont know if its up ngl. ');
    socket.destroy();
  }).on('error', (err) => {
    message.channel.send('🥵 Server appears to be OFFLINE.');
    console.error(`[STATUS] Connection error:`, err);
  }).connect(port, host);

  console.log(`[STATUS] Checking ${host}:${port}`);
}

// === !backup ===
  if (message.content === '!backup') {
    if (!Admin(message.member)) return message.reply('Shutup');

    message.reply('Running world backup...');
    exec("ssh executer@192.168.4.38 '/home/executer/backup-mc.sh'", (error, stdout, stderr) => {
      if (error) {
        console.error(`[Backup Error]: ${stderr}`);
        return message.reply('Backup failed.');
      }
      message.reply('Backup complete.');
    });
  }

  // === !restart server ===
  if (message.content === '!restart server') {
    if (!Admin(message.member)) return message.reply('No perms to restart the server.');

    message.reply('Backing up before restarting Minecraft server...');
    exec("ssh executer@192.168.4.38 '/home/executer/backup-mc.sh && systemctl stop minecraft-server.service && sleep 5 && systemctl start minecraft-server.service'", (error, stdout, stderr) => {
      if (error) {
        console.error(`[Restart Server Error]: ${stderr}`);
        return message.reply('Failed to restart the Minecraft server.');
      }
      message.reply('Minecraft server restarted.');
    });
  }

  // === !restart machine ===
  if (message.content === '!restart machine') {
    if (!Admin(message.member)) return message.reply('No perms to restart the machine.');

    message.reply('Backing up before rebooting server...');
    exec("ssh executer@192.168.4.38 '/home/executer/backup-mc.sh && sudo reboot'", (error, stdout, stderr) => {
      if (error) {
        console.error(`[Restart Machine Error]: ${stderr}`);
        return message.reply('Failed to reboot the server.');
      }
      message.reply('Server reboot initiated.');
    });
  }

  // === !shutdown ===
  if (message.content === '!shutdown') {
    if (!Admin(message.member)) return message.reply('No perms to shut this thing down.');

    message.reply('Backing up before shutdown...');
    exec("ssh executer@192.168.4.38 '/home/executer/backup-mc.sh && sudo shutdown now'", (error, stdout, stderr) => {
      if (error) {
        console.error(`[Shutdown Error]: ${stderr}`);
        return message.reply('Failed to shutdown the server.');
      }
      message.reply('Server is shutting down.');
    });
  }

  // === !sleep ===
  if (message.content === '!sleep') {
    if (!Admin(message.member)) return message.reply('No perms to put it to sleep.');

    message.reply('Backing up before suspend...');
    exec("ssh executer@192.168.4.38 '/home/executer/backup-mc.sh && sudo systemctl suspend'", (error, stdout, stderr) => {
      if (error) {
        console.error(`[Sleep Error]: ${stderr}`);
        return message.reply('Failed to suspend the server.');
      }
      message.reply('Server has entered suspend mode.');
    });
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
        if (!message.member.roles.cache.some(role => ['Web Wresteler'].includes(role.name))) {
      return message.reply('Fuck off, you don’t have permission to do that.');
    }
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
        let responses;
    if (message.author.id === JOSUE_ID) {
      responses = [
        { text: "Anything for you oh mighty grandmaster Josue the great!", weight: 4 },
        { text: "You again? Always on some bullshit, stfu im starting it.", weight: 3 },
        { text: "BAAAH IM FUCKING TWEAKING, PLEASE KILL ME PLEEEASE", weight: 2 },
        { text: "Im gonna beat the shit out of dot. Your dog dot. Im gonna beat her to fucking pulp Josue", weight: 1 }
      ];
    } else {
      responses = [
        { text: " ✅ WOL signal sent! The server should be waking up. Checking for server response.", weight: 5 },
        { text: " ✅ Attempting to boot the server up! Checking for server response.", weight: 5 },
        { text: " ✅ Server should be up soon. Checking for server response.", weight: 5 },
        { text: " Type shit! Attempting to boot server now.", weight: 3 },
        { text: " 🌚 THANK YOUU I LOVE BOOTING SERVERS! THAT'S MY ONE PURPOSE IN LIFE!!!", weight: 2 },
        { text: " Hold on lemme boot that shit up!!", weight: 3 },
        { text: " 🫃", weight: 1 },
        { text: " Shut up dickhead.", weight: 1 }
      ];
    }
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
            message.channel.send('🥵😢 Server did not come online within 1 minute, try again or something idk');
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
