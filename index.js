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
const RONAN_ID = "227121659121893378";
const JOSUE_ID = "737173833257189447";
const GABE_ID = "283318534426329088";
const WOL_PORT = 9;
const BOT_TOKEN = process.env.DISCORD_TOKEN;

function Admin(member) {
  return member.roles.cache.some(role =>
    ['Trout', 'Web Wresteler'].includes(role.name)
  );
}

function User(member) {
  return member.roles.cache.some(role =>
    ['Minecrapper','Trout', 'Web Wresteler'].includes(role.name)
  );
}

const responses = {
  startserver: [
    { text: "Booting up! Hold on...", weight: 4 },
    { text: "The server's waking up. Go grab a drink.", weight: 2 },
    { text: " ✅ WOL signal sent! The server should be waking up. Checking for server response.", weight: 4 },
    { text: " ✅ Attempting to boot the server up! Checking for server response.", weight: 4 },
    { text: " ✅ Server should be up soon. Checking for server response.", weight: 4 },
    { text: " Type shit! Attempting to boot server now.", weight: 3 },
    { text: " 🌚 THANK YOUU I LOVE BOOTING SERVERS! THAT'S MY ONE PURPOSE IN LIFE!!!", weight: 2 },
    { text: " Hold on lemme boot that shit up!!", weight: 3 },
    { text: "k.", weight: 2 },
    { text: "https://www.istockphoto.com/photos/hairy-old-man", weight: 1},
    { text: " 🫃", weight: 1 },
    { text: " Shut up dickhead.", weight: 1 }
  ],
  sleep: [
    { text: "Goin tf to bed, gn.", weight: 2 },
    { text: "Server suspending, wake me up later.", weight: 3 },
    { text: "Server successfully put to sleep.", weight: 4 },
    { text: "Jesus you were playing for a fucking while.", weight: 2},
    { text: "Server successfully tucked into bed.", weight: 3 },
    { text: "Going to sleep now, night night.", weight: 2 },
    { text: "Hell yeah, gonna go watch reels and sleep now.", weight: 2 },
    { text: "Server sleeping, go fuck off now.", weight: 1 },
  ],
  status: {
    on: [
      { text: "It's up and running, you needy shit.", weight: 2 },
      { text: "Online, as always. What did you expect?", weight: 2 },
      { text: "Blah Blah Blah, its up. Fuck off.", weight: 1},
      { text: "Server's alive and so am I. For now.", weight: 3 },
      { text: "🥶 Server is ONLINE and reachable.", weight: 4},
    ],
    timeout: [
      { text: "😬 It timed out, dont know if its up ngl. ", weight: 4 },
      { text: "Took too long, gave up, idk.", weight: 3 },
      { text: "It timed out, gonna go jerk off or something.", weight: 1},
      { text: "Fuck off, I dont know.", weight: 2},
      { text: "Dont know lil bro, how bout you try again.", weight: 2 }
    ],
    off: [
      { text: "🥵 Server appears to be OFFLINE.", weight: 4 },
      { text: '"!status" 🤓, shits off rn asshole.', weight: 2 },
      { text: "Dead as hell. Go touch grass.", weight: 3 },
      // { sequence: [
      // { text: "FUCK OFF!!!!", delay: 1000 },
      // { text: "SERVER IS FUCKING OFF AND IM TRYING TO REST YOU DICK HEAD!", delay: 1500 },
      // { text: "GO PLAY SOME OTHER FUCKING GAME, DO YOU REALLY THINK MINECRAFT IS ALL THERE IS YOU SACK OF SHIT?!?", delay: 2000 },
      // { text: "Sorry that was harsh.", delay: 1500 }
      // ],weight: 1},
      { text: "Server's off. Try turning it on, genius.", weight: 3 }
    ]
  }
};



function getRandomResponse(responses) {
  const weightedPool = responses.flatMap(r => Array(r.weight || 1).fill(r));
  return weightedPool[Math.floor(Math.random() * weightedPool.length)];
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

!startserver            Wakes up the Minecraft server via WOL
!sleep                  Puts the Server to sleep
!playerslist            Shows who’s currently online
!status                 Checks if the server is online
!test                   Tests if bot is working
!whitelist list         List all whitelisted users
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
  console.log('[STATUS] !status command received');
  const host = RCON_HOST;
  const port = 25565;
  const socket = new net.Socket();
  socket.setTimeout(2000);

  socket.on('connect', () => {
    console.log('[STATUS] Server is ONLINE');
    const reply = getRandomResponse(responses.status.on);
    message.channel.send(reply.text);    
    socket.destroy();
  });

  socket.on('timeout', () => {
    console.log('[STATUS] Connection TIMED OUT');
    const reply = getRandomResponse(responses.status.timeout);
    message.channel.send(reply.text);   
    socket.destroy();
  });

  socket.on('error', (err) => {
    console.log('[STATUS] Connection ERROR:', err.message);
    const reply = getRandomResponse(responses.status.off);
    message.channel.send(reply.text);   
    console.error(`[STATUS] Connection error:`, err);
  });

  socket.connect(port, host);
}


// === !backup ===
  if (message.content === '!backup') {
    if (!Admin(message.member)) return message.reply('Shutup');

    message.reply('Running world backup...');
    exec("ssh executer@192.168.4.38 'sudo -u serveradmin /home/executer/backup-mc.sh'", (error, stdout, stderr) => {
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
    exec("ssh executer@192.168.4.38 'sudo -u serveradmin /home/executer/backup-mc.sh && sudo -u serveradmin systemctl stop minecraft-server.service && sleep 5 && sudo -u serveradmin systemctl start minecraft-server.service'", (error, stdout, stderr) => {
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
    exec("ssh executer@192.168.4.38 'sudo -u serveradmin /home/executer/backup-mc.sh && sudo -u serveradmin reboot'", (error, stdout, stderr) => {
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
    exec("ssh executer@192.168.4.38 'sudo -u serveradmin /home/executer/backup-mc.sh && sudo -u serveradmin shutdown now'", (error, stdout, stderr) => {
      if (error) {
        console.error(`[Shutdown Error]: ${stderr}`);
        return message.reply('Failed to shutdown the server.');
      }
      message.reply('Server is shutting down.');
    });
  }

  // === !sleep ===
  if (message.content === '!sleep') {
    if (!User(message.member)) return message.reply('No perms to put it to sleep.');

    message.reply('Backing up before suspend...');
    exec("ssh executer@192.168.4.38 'nohup bash -c \"sudo -u serveradmin /home/executer/backup-mc.sh && sudo -u serveradmin systemctl suspend\" > /dev/null 2>&1 &'", (error, stdout, stderr) => {
      if (error) {
        console.error(`[Sleep Error]: ${stderr}`);
        return message.reply('Failed to suspend the server.');
      }
      const reply = getRandomResponse(responses.sleep);
      message.channel.send(reply.text);
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

 if (content === '!startserver') {
    // Cooldown logic
    if (cooldown) {
      message.channel.send("Hold your fucking horses, I'm starting the server already.");
      setTimeout(() => {
        message.reply("I'll hit you with a rock.");
      }, 3000);
      setTimeout(() => {
        message.channel.send("https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2Fkschongphotography1%2F&psig=AOvVaw3uHl0HuGg2pUSjxk_wt7GS&ust=1752283891621000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCPjasajUs44DFQAAAAAdAAAAABAE");
      }, 6000);
      return;
    }

    cooldown = true;
    setTimeout(() => cooldown = false, 60 * 1000);

    wol(MAC_ADDRESS, { address: BROADCAST_IP, port: WOL_PORT })
      .then(() => {
        let replies;
        if (message.author.id === JOSUE_ID) {
          replies = [
            { text: "Anything for you oh mighty grandmaster Josue the great!", weight: 4 },
            ...responses.startserver,
            { text: "You again? Always on some bullshit, stfu im starting it.", weight: 3 },
            { text: "BAAAH IM FUCKING TWEAKING, PLEASE KILL ME PLEEEASE", weight: 2 },
            { text: "Im gonna beat the shit out of dot. Your dog scott. Im gonna beat her to fucking pulp Josue", weight: 1 }
          ];
          } else if (message.author.id === RONAN_ID) {
          replies = [
          { text: "Hi Ronan", weight: 2 },
         ...responses.startserver,
         { text: "Im farting on your dog right now Ronan, Otto is all smelly n shit.", weight: 2 }
         ];
        } else if (message.author.id === GABE_ID) {
          replies = [
          { text: "Starting the server but oh my god do you fucking smell gabe, go shower dick.", weight: 2 },
         ...responses.startserver,
         { text: "Im gonna start this server then smoke all your weed gabe.", weight: 2 }
         ];
        }
        else {
          replies = [...responses.startserver];
        }
        const reply = getRandomResponse(replies);
        message.channel.send(reply.text);

        // Server polling logic (unchanged)
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
