const Discord = require('discord.js');
const axios = require('axios');

const { EmbedBuilder } = require('discord.js');

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ]
});

const channelId = 'INSERT DISCORD CHANNEL ID';
const server = 'INSERT MC SERVER IP';
const imagelink = 'OPTIONAL - INSERT IMAGE LINK'; //do not remove this line, if you do not want an image leave this line how it is
const bottoken = 'INSERT BOT TOKEN';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  sendMessage();
  setInterval(sendMessage, 60000);
  client.user.setStatus('dnd');
});

function extractVersionNumbers(versionString) {
  const versionRegex = /[\d.]+/g;
  const versionNumbers = versionString.match(versionRegex);
  return versionNumbers ? versionNumbers.join('') : '';
}

function sendMessage() {
  axios.get('https://api.mcstatus.io/v2/status/java/'+server)
    .then(response => {
      const data = response.data;
      if (data.players && typeof data.players.online !== 'undefined') {
      client.user.setActivity(`${data.players.online} Playing ${data.host}`);}
      const version = extractVersionNumbers(data.version.name_raw);
      let servport;
      if(data.port!=25565){
        servport=`${data.port}`;
      }
      else{
        servport="";
      }
      const servipport=`${data.host}${servport}`;

const newdate = new Date();
let datehours = newdate.getUTCHours();
let dateminutes = newdate.getUTCMinutes();
let dateseconds = newdate.getUTCSeconds();
let datemilliseconds = newdate.getUTCMilliseconds();
let dateyear = newdate.getUTCFullYear();
let datemonth = newdate.getUTCMonth();
let dateday = newdate.getUTCDate();
let timestamp = datehours+":"+dateminutes+":"+dateseconds+":"+datemilliseconds+" on "+dateday+"/"+datemonth+"/"+dateyear;

      const embed = new EmbedBuilder()
        .setTitle(String(servipport)+"'s Server Status")
        .addFields(
          { name: 'Online', value: String(data.online) },
          { name: 'IP', value: String(servipport) },
          { name: 'Version', value: String(version) },
          { name: 'Players Online', value: String(data.players.online)+"/"+String(data.players.max) },
          { name: 'MOTD', value: String(data.motd.raw) }
        );

            if(imagelink != 'OPTIONAL - INSERT IMAGE LINK')
            {
                embed.setImage(imagelink);
            };

const channel = client.channels.cache.get(channelId);
channel.messages.fetch({ limit: 1 })
  .then(messages => {
    const lastMessage = messages.last();
    if (lastMessage && lastMessage.author.id === client.user.id) {
      lastMessage.edit({ embeds: [embed] })
        .catch(error => {
          console.log('Error editing server status embed: ', error.message, error);
        });
        console.log(`Edited at ${timestamp}`);
    } else {
      channel.send({ embeds: [embed] })
        .catch(error => {
          console.log('Error sending server status embed: ', error.message, error);
        });
        console.log(`Sent at ${timestamp}`);
      }})
  .catch(error => {
    console.log('Error fetching bot message: ', error.message, error);
  });
})};
client.login(bottoken);
