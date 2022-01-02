const { MessageEmbed } = require('discord.js');
const { max } = require('moment');
module.exports.run = async (client, interaction) => {
    try {
        let works = require(`${client.config.jsonPath}works.json`);
	    let noUser = new MessageEmbed()
		    .setColor(client.config.embedColor)
		    .setTitle('Ошибка')
            .setDescription('Пользователь не найден в базе данных.')
	    try {
		    var user = await client.users.fetch(interaction.member.user.id);
	    } catch (error) {
		    return interaction.reply({embeds: [noUser], ephemeral: true})
	    }
        let userdb = await client.db.getUser(interaction.member.user.id)
        try {
			var channel = await client.channels.fetch(interaction.channelId);
		} catch (error) {
			return interaction.reply({content: 'Не могу получить доступ к текстовому каналу.', ephemeral: true})
		}
	    var whattoDo = interaction.options.getSubcommand();
        switch (whattoDo) {
            case 'список': {
                let workList = new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setTitle('Работа')
                    .addField(`1. ${works[0].name}`, works[0].description, false)
                    .addField(`2. ${works[1].name}`, works[1].description, false)
                    .addField(`3. ${works[2].name}`, works[2].description, false)
                    .setTimestamp()
                    .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
                interaction.reply({embeds: [workList]})
                break
            }
            case 'ранги': {
                if(userdb.work_current == '') {
                    interaction.reply({content: 'У вас нет работы.', ephemeral: true})
                    break
                }
                let curRank = userdb.work_rank;
                let curWork = works.find(w => w.codename == userdb.work_current);
                var nextRank = curRank + 1;
                if(curRank == 5)
                    nextRank = 5;
                let rankList = new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setTitle('Ранги')
                    .setDescription(`Ваша текущая работа — ${curWork.name}
                        Ваш ранг — ${curWork.ranks[curRank].name}
                        Опыт: ${userdb.work_currentXP}/${curWork.ranks[nextRank].requiredXP} XP`)
                    .addField(`1. ${curWork.ranks[0].name}`, `Доход: ${curWork.ranks[0].income} ${client.emoji.fish}`, false)
                    .addField(`2. ${curWork.ranks[1].name}`, `Доход: ${curWork.ranks[1].income} ${client.emoji.fish}`, false)
                    .addField(`3. ${curWork.ranks[2].name}`, `Доход: ${curWork.ranks[2].income} ${client.emoji.fish}`, false)
                    .addField(`4. ${curWork.ranks[3].name}`, `Доход: ${curWork.ranks[3].income} ${client.emoji.fish}`, false)
                    .addField(`5. ${curWork.ranks[4].name}`, `Доход: ${curWork.ranks[4].income} ${client.emoji.fish}`, false)
                    .addField(`6. ${curWork.ranks[5].name}`, `Доход: ${curWork.ranks[5].income} ${client.emoji.fish}`, false)
                    .setTimestamp()
                    .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
                interaction.reply({embeds: [rankList]})
                break
            }
            case 'устроиться': {
                let workID = interaction.options.getInteger('номер') - 1
                if(workID < 1 || workID > 3) {
                    interaction.reply({content: "Укажите корректный номер работы.", ephemeral: true})
                    break
                }
                if(userdb.work_current != '') {
                    interaction.reply({content: "Сначала увольтесь с текущей работы — /работа уволиться.", ephemeral: true})
                    break
                }
                var prevWork = "";
                if(workID != 0){
                    var razn = workID - 1;
                    prevWork = works[razn].codename;
                }
                if(userdb.work_previous != prevWork) {
                    interaction.reply({content: `Вам необходимо получить все ранги на работе ${works[razn].name}.`, ephemeral: true})
                    break
                }
                client.db.changeUser(interaction.member.user.id, 'work_current', works[workID].codename)
                client.db.changeUser(interaction.member.user.id, 'work_currentXP', 0)
                client.db.changeUser(interaction.member.user.id, 'work_rank', 0)
                let successEmbed = new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setTitle('Успешно')
                    .setDescription(`Вы устроились на работу — ${works[workID].name}. Ваш текущий ранг: ${works[workID].ranks[0].name}`)
                    .setTimestamp()
                    .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
                interaction.reply({embeds: [successEmbed]})
                break
            }
            case 'уволиться': {
                if(userdb.work_current == '') {
                    interaction.reply({content: "У вас нет работы.", ephemeral: true})
                    break
                }
                let curRank = userdb.work_rank + 1;
                let curWork = works.find(w => w.codename == userdb.work_current)
                let curWorkIndex = works.findIndex(w => w.codename == userdb.work_current)
                var toAdd = ``;
                if(curRank == curWork.ranks.length){
                    client.db.changeUser(interaction.member.user.id, 'work_previous', curWork.codename)
                    if(curWorkIndex < 2)
                        var abc = curWorkIndex + 1;
                    toAdd = `Теперь вам доступна новая работа — ${works[abc].name}!`
                }
                client.db.changeUser(interaction.member.user.id, 'work_current', "")
                client.db.changeUser(interaction.member.user.id, 'work_currentXP', 0)
                client.db.changeUser(interaction.member.user.id, 'work_rank', 0)
                let successEmbed = new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setTitle('Успешно')
                    .setDescription(`Вы уволились с текущей работы — ${curWork.name}. ${toAdd}`)
                    .setTimestamp()
                    .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
                interaction.reply({embeds: [successEmbed]})
                break
            }
            case 'работать': {
                function randomInt(min, max) {
                    let rand = min - 0.5 + Math.random() * (max - min + 1);
                    return Math.round(rand);
                }
                let curRank = userdb.work_rank;
                let curWork = works.find(w => w.codename == userdb.work_current)
                let taskType = randomInt(1, 2);
                switch (taskType) {
                    case 1: {
                        let taskChet = randomInt(0, 1);
                        if(taskChet == 1)
                            var chetType = `нечётное`;
                        else
                            var chetType = `чётное`;
                        let taskZnak = randomInt(1, 4);
                        let workEmbed = new MessageEmbed()
                            .setColor(client.config.embedColor)
                            .setTitle('Работа')
                            .setDescription(`Напишите любое **${chetType} ${taskZnak}-х значное** число.`)
                            .setTimestamp()
                            .setFooter({ text: `${user.tag} • У вас 10 секунд. Отправьте сообщение с числом.`, iconURL: user.displayAvatarURL({dynamic: true}) })
                        interaction.reply({embeds: [workEmbed]})
                        const filter = message => message.author.id === interaction.member.user.id;
			            const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 10000 });
			            var answered = false;
                        collector.on('collect', async m => {
                            let check = Number(m.content) % 2;
                            if (taskZnak == m.content.toString().length && taskChet == check) {
                                let wonXP = randomInt(1, 2);
                                client.db.changeUser(interaction.member.user.id, 'work_currentXP', (userdb.work_currentXP + wonXP))
                                client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + curWork.ranks[curRank].income))
                                let checkNextRank = userdb.work_rank + 1;
                                var toAdd = ``;
                                if (curWork.ranks[checkNextRank]) {
                                    if(userdb.work_currentXP > curWork.ranks[checkNextRank].requiredXP){
                                        client.db.changeUser(interaction.member.user.id, 'work_rank', (userdb.work_rank + 1))
                                        toAdd = `\n**У вас новый ранг: ${curWork.ranks[checkNextRank].name}**`;
                                    }
                                }
                                let successEmbed = new MessageEmbed()
                                    .setColor(client.config.embedColor)
                                    .setTitle("Работа: успешно")
                                    .setDescription(`Вы выполнили задание.
                                        Получено ${wonXP} XP и ${curWork.ranks[curRank].income} ${client.emoji.fish}. ${toAdd}`)
                                    .setTimestamp()
                                    .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
                                interaction.editReply({embeds: [successEmbed]})
                                answered = true
                                return collector.stop()
                            }else{
                                var toAddErr = ``
                                if(userdb.work_currentXP != 0){
                                    client.db.changeUser(interaction.member.user.id, 'work_currentXP', (userdb.work_currentXP - 1))
                                    toAddErr = `Вы потеряли 1 XP.`
                                    if(userdb.balance_fish > curWork.ranks[curRank].income){
                                        client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish - curWork.ranks[curRank].income))
                                        toAddErr = `Вы потеряли 1 XP и ${curWork.ranks[curRank].income} ${client.emoji.fish}.`;
                                    }
                                }
                                let letError = new MessageEmbed()
                                    .setColor(client.config.embedColor)
                                    .setTitle("Работа: ошибка")
                                    .setDescription(`Допущена ошибка. ${toAddErr}`)
                                    .setTimestamp()
                                    .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
                                interaction.editReply({embeds: [letError]})
                                answered = true
                                return collector.stop()
                            }
                        })
                        collector.on('end', collected => {
                            if (!answered) {
                                var toAddErr = ``
                                if(userdb.work_currentXP != 0){
                                    client.db.changeUser(interaction.member.user.id, 'work_currentXP', (userdb.work_currentXP - 1))
                                    toAddErr = `Вы потеряли 1 XP.`;
                                }
                                let timeOut = new MessageEmbed()
                                    .setColor(client.config.embedColor)
                                    .setTitle('Работа: ошибка')
                                    .setDescription(`Время истекло. ${toAddErr}`)
                                    .setTimestamp()
                                    .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
                                return interaction.editReply({embeds: [timeOut]})
                            } else {
                                return 
                            }
                        })
                        break
                    }
                    case 2: {
                        let random1 = randomInt(1, 3);
                        if(random1 == 1){
                            var firstNum = randomInt(10, 25);
                            var secondNum = randomInt(26, 40);
                            var thirdNum = randomInt(41, 100);
                        }
                        if(random1 == 2){
                            var firstNum = randomInt(35, 76);
                            var secondNum = randomInt(12, 34);
                            var thirdNum = randomInt(77, 256);
                        }
                        if(random1 == 3){
                            var firstNum = randomInt(64, 96);
                            var secondNum = randomInt(34, 63);
                            var thirdNum = randomInt(5, 33);
                        }
                        let workEmbed = new MessageEmbed()
                            .setColor(client.config.embedColor)
                            .setTitle('Работа')
                            .setDescription(`Напишите наибольшее число: **${firstNum}**, **${secondNum}**, **${thirdNum}**.`)
                            .setTimestamp()
                            .setFooter({ text: `${user.tag} • У вас 10 секунд. Отправьте сообщение с числом.`, iconURL: user.displayAvatarURL({dynamic: true}) })
                        interaction.reply({embeds: [workEmbed]})
                        const filter = message => message.author.id === interaction.member.user.id;
			            const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 10000 });
			            var answered = false;
                        collector.on('collect', async m => {
                            if (Number(m.content) == Math.max(firstNum, secondNum, thirdNum)) {
                                let wonXP = randomInt(1, 2);
                                client.db.changeUser(interaction.member.user.id, 'work_currentXP', (userdb.work_currentXP + wonXP))
                                client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish + curWork.ranks[curRank].income))
                                let checkNextRank = userdb.work_rank + 1;
                                var toAdd = ``;
                                if(userdb.work_currentXP > curWork.ranks[checkNextRank].requiredXP){
                                    client.db.changeUser(interaction.member.user.id, 'work_rank', (userdb.work_rank + 1))
                                    toAdd = `\n**У вас новый ранг: ${curWork.ranks[checkNextRank].name}**`;
                                }
                                let successEmbed = new MessageEmbed()
                                    .setColor(client.config.embedColor)
                                    .setTitle("Работа: успешно")
                                    .setDescription(`Вы выполнили задание.
                                        Получено ${wonXP} XP и ${curWork.ranks[curRank].income} ${client.emoji.fish}. ${toAdd}`)
                                    .setTimestamp()
                                    .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
                                interaction.editReply({embeds: [successEmbed]})
                                answered = true
                                return collector.stop()
                            }else{
                                var toAddErr = ``
                                if(userdb.work_currentXP != 0){
                                    client.db.changeUser(interaction.member.user.id, 'work_currentXP', (userdb.work_currentXP - 1))
                                    toAddErr = `Вы потеряли 1 XP.`
                                    if(userdb.balance_fish > curWork.ranks[curRank].income){
                                        client.db.changeUser(interaction.member.user.id, 'balance_fish', (userdb.balance_fish - curWork.ranks[curRank].income))
                                        toAddErr = `Вы потеряли 1 XP и ${curWork.ranks[curRank].income} ${client.emoji.fish}.`;
                                    }
                                    
                                }
                                let letError = new MessageEmbed()
                                    .setColor(client.config.embedColor)
                                    .setTitle('Работа: ошибка')
                                    .setDescription(`Допущена ошибка. ${toAddErr}`)
                                    .setTimestamp()
                                    .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
                                interaction.editReply({embeds: [letError]})
                                answered = true
                                return collector.stop()
                            }
                        })
                        collector.on('end', collected => {
                            if (!answered) {
                                var toAddErr = ``
                                if(userdb.work_currentXP != 0){
                                    client.db.changeUser(interaction.member.user.id, 'work_currentXP', (userdb.work_currentXP - 1))
                                    toAddErr = `Вы потеряли 1 XP.`;
                                }
                                let timeOut = new MessageEmbed()
                                    .setColor(client.config.embedColor)
                                    .setTitle("Работа: ошибка")
                                    .setDescription(`Время истекло. ${toAddErr}`)
                                    .setTimestamp()
                                    .setFooter({ text: user.tag, iconURL: user.displayAvatarURL({dynamic: true}) })
                                return interaction.editReply({embeds: [timeOut]})
                            } else {
                                return 
                            }
                        })
                    }
                    break
                }
                break
            }
        }
    } catch (error) {
        client.logger.log(error, 'err')
        console.error(error)
        interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
    }
};

module.exports.data = {
    name: "работа",
	permissions: ["member"],
	type: "interaction"
};