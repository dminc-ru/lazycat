const { QueryType } = require('discord-player');
const { MessageEmbed } = require('discord.js');
module.exports.run = async (client, interaction) => {
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
    let notFound = new MessageEmbed()
        .setColor(client.config.embedColor)
        .setTitle('Ничего не найдено.')
        .setTimestamp()
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
    if (!searchResult || !searchResult.tracks.length) return void interaction.followUp({ embeds: [notFound] });
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
        var queue = await client.player.createQueue(guild, {
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
        let cantJoin = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle('Ошибка')
            .setDescription('Не могу присоединиться к голосовому каналу.')
            .setTimestamp()
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
        return void interaction.followUp({ embeds: [cantJoin] });
    }
        let loadingEmbed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(`Загрузка ${searchResult.playlist ? 'плейлиста' : 'трека'}...`)
            .setTimestamp()
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
        await interaction.followUp({ embeds: [loadingEmbed] });
        if (!playNext || !queue.playing) {
            searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        } else {
            queue.insert(searchResult.tracks[0]);
        }
        if (!queue.playing) await queue.play();
}

module.exports.data = {
    name: 'плей',
    permissions: ["tester"],
    type: "interaction"
}