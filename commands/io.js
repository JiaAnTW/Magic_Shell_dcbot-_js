const {
    entersState,
    joinVoiceChannel,
    VoiceConnection,
    VoiceConnectionStatus,
} = require('@discordjs/voice');
const { GuildMember } = require('discord.js');
const { playVoice } = require('../utils/playVoice.js');

let triggerPosibility = 0.1;
let lock = false;

function setLock(value) {
    lock = value;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is
}

module.exports.setTriggerPosibility = async function setTriggerPosibility(
    message,
    client,
    connection,
    setConnection
) {
    try {
        const value =
            Math.round(parseFloat(message.content.substring(6)) * 10000) /
            10000;
        if (value > 1 || value < 0) {
            triggerPosibility = 0;
            return;
        }
        console.log(`活躍度設定為${value}`);
        triggerPosibility = value;
    } catch (err) {
        console.log(err);
    }
};

module.exports.random = async function join(
    message,
    client,
    connection,
    setConnection
) {
    try {
        const cilentCommand = message.content.split(' ');
        console.log(cilentCommand);
        let ctn = Number(cilentCommand[1]);
        let pool = cilentCommand.slice(2);
        let res = [];
        while (ctn > 0 && 0 < pool.length) {
            let i = getRandomInt(0, pool.length - 1);
            if (!pool[i] || pool[i] === '') {
                pool.splice(i, 1);
                continue;
            }
            res.push(pool[i]);
            pool.splice(i, 1);
            ctn--;
        }
        console.log(res);
        message.reply(`抽籤結果: ${res.join(',')}`);
    } catch (error) {
        console.warn(error);
        setConnection(undefined);
    }
};

module.exports.join = async function join(
    message,
    client,
    connection,
    setConnection
) {
    try {
        if (!connection) {
            if (message.member.voice.channel) {
                const channel = message.member.voice.channel;
                connection = joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    selfDeaf: false,
                    selfMute: false,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });
                setConnection(connection);
            } else {
                return;
            }
        }

        await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
        const receiver = connection.receiver;

        receiver.speaking.on('start', userId => {
            const seed = Math.random();
            if (lock) return;

            if (seed <= triggerPosibility) {
                setLock(true);
                playVoice(connection, setLock);
            }
        });
    } catch (error) {
        console.warn(error);
        setConnection(undefined);
    }
};

module.exports.leave = async function leave(
    message,
    client,
    connection,
    setConnection
) {
    try {
        console.log(connection);
        connection.disconnect();
        setConnection(undefined);
    } catch (error) {
        console.warn(error);
        setConnection(undefined);
    }
};
