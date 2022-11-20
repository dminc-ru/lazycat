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
                requestedBy: interaction.member
            })
            .catch(() => {
                console.log(`[${interaction.guild_id}] Track search error.`);
            });
        let notFound = client.utils.embed('Ничего не найдено.', undefined, user)
        if (!searchResult || !searchResult.tracks.length) return void interaction.followUp({ embeds: [notFound] });
        var queue = client.player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) {
            queue = await client.player.createQueue(guild, {
                leaveOnEmpty: true,
                leaveOnStop: true,
                leaveOnEnd: true,
                leaveOnEmptyCooldown: 2000,
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
            await queue.play();
        } else {
            queue.insert(searchResult.tracks[0]);
            let trackQueued = new MessageEmbed()
                .setColor('#b88fff')
                .setTitle('Трек добавлен в очередь')
                .setThumbnail(track.thumbnail)
                .addField('Трек', `${track.title}`, false)
                .addField('Канал', `<#${queue.connection.channel.id}>`)
            return void interaction.reply({ embeds: [trackQueued]})
        }
    }
}

module.exports = Play;