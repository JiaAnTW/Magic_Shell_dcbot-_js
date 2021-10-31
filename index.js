const Discord = require('discord.js');
const { commands } = require('./commands/index.js');
const { getVoiceConnection } = require('@discordjs/voice');
require('dotenv').config();

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const token = process.env['DISCORD_WEBHOOK'];

let connection = undefined;
const setConnection = connectionNext => {
    connection = connectionNext;
};
const client = new Discord.Client({
    intents: ['GUILD_VOICE_STATES', 'GUILD_MESSAGES', 'GUILDS'],
});

client.on('ready', () => console.log('Ready!'));

client.on('messageCreate', async message => {
    try {
        if (!message.guild) return;
        if (!client.application?.owner) await client.application?.fetch();

        const cilentCommand = message.content.split(' ')[0];

        const action = commands[cilentCommand];
        if (commands[cilentCommand]) {
            action(message, client, connection, setConnection);
        }
    } catch (error) {
        console.warn(error);
    }
});

client.on('error', console.warn);

client.login(token);

process.on('exit', function() {
    if (connection) connection.disconnect();
});
