const Command = require('../../class/Command')

class Fskip extends Command {
    constructor(client) {
        super(client, {
            name: 'фскип',
            permissions: ['member'],
            type: 'interaction',
            enabled: true,
            guildOnly: true
        })
    }

    async run (client, interaction) {
        interaction.reply({content: `Команда временно недоступна.`, ephemeral: true})
        /*await interaction.deferReply();
        var user = client.users.cache.get(interaction.member.user.id)
        const queue = client.player.getQueue(interaction.guildId);
        let noMusic = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle('Очередь пуста.')
            .setTimestamp()
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
        if (!queue) return void interaction.followUp({ embeds: [noMusic] });
        const trackIndex = interaction.options.getInteger('номер') - 1;
        if ( (queue.length - 1) > trackIndex) {
            return interaction.followUp({ content: `Произошла ошибка.` })
        }
        queue.remove(trackIndex);
        let removed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle('Трек удалён.')
            .setTimestamp()
            .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
        interaction.followUp({ embeds: [removed] });*/
    }
}

module.exports = Fskip;