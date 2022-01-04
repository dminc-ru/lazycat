const { QueryType } = require('discord-player');
module.exports.run = async (client, interaction) => {
    await interaction.deferReply();
    const guild = client.guilds.cache.get(interaction.guildId);
    const channel = guild.channels.cache.get(interaction.channelId);
    const query = interaction.options.getString('запрос');
    const searchResult = await client.player
        .search(query, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        })
        .catch(() => {
            console.log('he');
        });
    if (!searchResult || !searchResult.tracks.length) return void interaction.followUp({ content: 'Ничего не найдено.' });

    const queue = await client.player.createQueue(guild, {
        ytdlOptions: {
            filter: 'audioonly',
            highWaterMark: 1 << 30,
            dlChunkSize: 0,
        },
        metadata: channel
    });

    const member = guild.members.cache.get(interaction.member.user.id) ?? await guild.members.fetch(interaction.member.user.id);
    try {
        if (!queue.connection) await queue.connect(member.voice.channel);
    } catch {
        void client.player.deleteQueue(ctx.guildID);
        return void interaction.followUp({ content: 'Не могу присоединиться к голосовому каналу.' });
    }

        await interaction.followUp({ content: `Загружается ${searchResult.playlist ? 'плейлист' : 'трек'}...` });
        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        if (!queue.playing) await queue.play();
}

module.exports.data = {
    name: 'плей',
    permissions: ["tester"],
    type: "interaction"
}