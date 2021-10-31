const {
    createAudioPlayer,
    createAudioResource,
    entersState,
    AudioPlayerStatus,
} = require('@discordjs/voice');

const voiceData = [];

for (let i = 1; i < 14; ++i) {
    voiceData.push(
        `https://github.com/chichichen10/Magic_Shell_dcbot/raw/master/voice_${i}.mp3`
    );
}

module.exports.playVoice = async function playVoice(connection, setLock) {
    try {
        const player = createAudioPlayer();
        const randomPick = Math.floor(Math.random() * voiceData.length);
        const resource = createAudioResource(voiceData[randomPick], {
            inlineVolume: true,
        });

        player.on('error', error => {
            console.error(
                `Error: ${error.message} with resource ${error.resource.metadata.title}`
            );
            player.stop(true);
            entersState(player, AudioPlayerStatus.Idle, 5e3);
        });

        player.on(AudioPlayerStatus.Idle, e => {
            setLock(false);
        });

        player.play(resource);
        await entersState(player, AudioPlayerStatus.Playing, 5e3);
        connection.subscribe(player);
    } catch (error) {
        console.error(error);
        setLock(false);
    }
};
