module.exports.run = async (client, interaction) => {
        let works = require(`${client.config.jsonPath}works.json`);
	    let user = await client.users.fetch(interaction.member.user.id);
        let userdb = await client.db.getUser(interaction.member.user.id)
        let channel = await client.channels.fetch(interaction.channel_id);
	    var whattoDo = interaction.data.options[0].name;
        if(whattoDo == "список"){
            let workList = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setTitle('Работа')
                .addField(`1. ${works[0].name}`, works[0].description, false)
                .addField(`2. ${works[1].name}`, works[1].description, false)
                .addField(`3. ${works[2].name}`, works[2].description, false)
                .setTimestamp()
                .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
            return interaction.reply({embeds: [workList]})
        }
        if(whattoDo == "ранги"){
            if(userdb.work_current == '')
                return interaction.reply({content: 'У вас нет работы.', ephemeral: true})
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
                .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
            return interaction.reply({embeds: [rankList]})
        }
        if(whattoDo == "устроиться"){
            if(interaction.data.options[0].options[0].value < 1 || interaction.data.options[0].options[0].value > 3)
                return interaction.reply({content: "Укажите корректный номер работы.", ephemeral: true})
            if(userdb.work_current != '')
                return interaction.reply({content: "Сначала увольтесь с текущей работы — /работа уволиться.", ephemeral: true})
            let workID = interaction.data.options[0].options[0].value - 1;
            var prevWork = "";
            if(workID != 0){
                var razn = workID - 1;
                prevWork = works[razn].codename;
            }
            if(userdb.work_previous != prevWork)
                return interaction.reply({content: `Вам необходимо получить все ранги на работе ${works[razn].name}.`, ephemeral: true})
            client.db.changeUser(interaction.member.user.id, 'work_current', works[workID].codename)
            client.db.changeUser(interaction.member.user.id, 'work_currentXP', 0)
            client.db.changeUser(interaction.member.user.id, 'work_rank', 0)
            let successEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setTitle('Успешно')
                .setDescription(`Вы устроились на работу — ${works[workID].name}. Ваш текущий ранг: ${works[workID].ranks[0].name}`)
                .setTimestamp()
                .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
            return interaction.reply({embeds: [successEmbed]})
        }
        if(whattoDo == "уволиться"){
            if(userdb.work_current == '')
                return interaction.reply({content: "У вас нет работы.", ephemeral: true})
            let curRank = userdb.work_rank + 1;
            let curWork = works.find(w => w.codename == userdb.work_current)
            let curWorkIndex = works.findIndex(w => w.codename == userdb.work_current)
            var toAdd = ``;
            if(curRank == curWork.ranks.length){
                client.db.change(interaction.member.user.id, 'users', 'work_previous', curWork.codename)
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
                .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
            return interaction.reply({embeds: [successEmbed]})
        }
        if(whattoDo == "работать"){
            function randomInt(min, max) {
                let rand = min - 0.5 + Math.random() * (max - min + 1);
                return Math.round(rand);
            }
            let curRank = userdb.work_rank;
            let curWork = works.find(w => w.codename == userdb.work_current)
            let taskType = randomInt(1, 2);
            if(taskType == 1){
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
                    .setFooter(`${user.tag} • У вас 10 секунд. Отправьте сообщение с числом.`, user.displayAvatarURL({dynamic: true}))
                interaction.reply({embeds: [workEmbed]})
                try{
                    response = await channel.awaitMessages((message2) => interaction.member.user.id === message2.author.id, {
                        max: 1,
                        time: 10000,
                        errors: ['time']
                    });
                }catch(error){
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
                        .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
                    return interaction.editReply({embeds: [timeOut]})
                }
                let check = Number(response.first().content) % 2;
                if (taskZnak == response.first().content.toString().length && taskChet == check) {
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
                        .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
                    return interaction.editReply({embeds: [successEmbed]})
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
                        .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
                    return interaction.editReply({embeds: [letError]})
                }
            }
            if(taskType == 2){
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
                    .setFooter(`${user.tag} • У вас 10 секунд. Отправьте сообщение с числом.`, user.displayAvatarURL({dynamic: true}))
                interaction.reply({embeds: [workEmbed]})
                try{
                    response = await channel.awaitMessages((message2) => interaction.member.user.id === message2.author.id, {
                        max: 1,
                        time: 10000,
                        errors: ['time']
                    });
                }catch(error){
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
                        .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
                    return interaction.editReply({embeds: [timeOut]})
                }
                if(Number(response.first().content) == firstNum){
                    var checkNum1 = secondNum;
                    var checkNum2 = thirdNum;
                }
                if(Number(response.first().content) == secondNum){
                    var checkNum1 = firstNum;
                    var checkNum2 = thirdNum;
                }
                if(Number(response.first().content) == thirdNum){
                    var checkNum1 = firstNum;
                    var checkNum2 = secondNum;
                }
                if (Number(response.first().content) > checkNum1 && Number(response.first().content) > checkNum2) {
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
                        .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
                    return interaction.editReply({embeds: [successEmbed]})
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
                        .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
                    return interaction.editReply({embeds: [letError]})
                }
            }
        }
};

module.exports.data = {
    name: "работа",
	permissions: ["member"],
	type: "interaction"
};