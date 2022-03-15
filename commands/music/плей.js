const { QueryType } = require('discord-player');
const Command = require('../../class/Command')

class Play extends Command {
    constructor(client) {
        super(client, {
            name: 'плей',
            permissions: ['member'],
            type: 'interaction',
            enabled: true,
            guildOnly: true
        })
    }

    async run (client, interaction) {
        await interaction.deferReply();
        var user = client.users.cache.get(interaction.member.user.id)
        const guild = client.guilds.cache.get(interaction.guildId);
        const channel = guild.channels.cache.get(interaction.channelId);
        const playNext = interaction.options.getString('следующий')
        const query = interaction.options.getString('запрос');
        const searchResult = await client.player
            .search(query, {
                requestedBy: interaction.member,
                searchEngine: QueryType.AUTO
            })
            .catch(() => {
                console.log('wtf man');
            });
        let notFound = client.utils.embed('Ничего не найдено.', undefined, user)
        if (!searchResult || !searchResult.tracks.length) return void interaction.followUp({ embeds: [notFound] });
        var queue = client.player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) {
            queue = await client.player.createQueue(guild, {
                ytdlOptions: {
                    filter: 'audioonly',
                    highWaterMark: 1 << 30,
                    dlChunkSize: 0,
                },
                metadata: channel
            });
        }

        const member = guild.members.cache.get(interaction.member.user.id) ?? await guild.members.fetch(interaction.member.user.id);
        try {
            if (!queue.connection) await queue.connect(member.voice.channel);
        } catch {
            void client.player.deleteQueue(interaction.guildId);
            let cantJoin = client.utils.error('Не могу присоединиться к голосовому каналу.', user)
            return void interaction.followUp({ embeds: [cantJoin] });
        }
        let loadingEmbed = client.utils.embed(`Загрузка ${searchResult.playlist ? 'плейлиста' : 'трека'}...`, undefined, user)
        await interaction.followUp({ embeds: [loadingEmbed] });
        if (!playNext || !queue.playing) {
            searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        } else {
            queue.insert(searchResult.tracks[0]);
        }
        if (!queue.playing) await queue.play();
    }
}

module.exports = Play;