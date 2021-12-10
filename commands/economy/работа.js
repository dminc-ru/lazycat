let works = require(`${process.env.PATHTOBASE}/works.json`);
module.exports.run = async (client, interaction) => {
    try{
	    let user = client.users.cache.get(interaction.member.user.id);
        let userdb = await client.db.get(interaction.member.user.id, 'users')
        let channel = client.channels.cache.get(interaction.channel_id);
	    var whattoDo = interaction.data.options[0].name;
        if(whattoDo == "список"){
            return client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        embeds: [
                            {
                                color: 0xb88fff,
                                title: 'Работа',
                                fields: [
                                    {
                                        name: `1. ${works[0].name}`,
                                        value: `${works[0].description}`,
                                        inline: false
                                    },
                                    {
                                        name: `2. ${works[1].name}`,
                                        value: `${works[1].description}`,
                                        inline: false
                                    },
                                    {
                                        name: `3. ${works[2].name}`,
                                        value: `${works[2].description}`,
                                        inline: false
                                    }
                                ],
                                timestamp: new Date(),
                                footer: {
                                    text: `${user.tag}`,
                                    icon_url: `${user.displayAvatarURL()}`,
                                }
                            }
                        ]
                    }
                }
            });
        }
        if(whattoDo == "ранги"){
            if(userdb.work_current == ''){
                return client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            flags: 64,
                            content: `У вас нет работы.`
                        }
                    }
                });
            }
            let curRank = userdb.work_rank;
            let curWork = works.find(w => w.codename == userdb.work_current);
            var nextRank = curRank + 1;
            if(curRank == 5)
                nextRank = 5;
            return client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        embeds: [
                            {
                                color: 0xb88fff,
                                title: 'Ранги',
                                description: `Ваша текущая работа — ${curWork.name}\nВаш ранг — ${curWork.ranks[curRank].name}\nОпыт: ${userdb.work_currentXP}/${curWork.ranks[nextRank].requiredXP} XP`,
                                fields: [
                                    {
                                        name: `1. ${curWork.ranks[0].name}`,
                                        value: `Доход: ${curWork.ranks[0].income} <:lz_fish:742459590087803010>`,
                                        inline: false
                                    },
                                    {
                                        name: `2. ${curWork.ranks[1].name}`,
                                        value: `Доход: ${curWork.ranks[1].income} <:lz_fish:742459590087803010>`,
                                        inline: false
                                    },
                                    {
                                        name: `3. ${curWork.ranks[2].name}`,
                                        value: `Доход: ${curWork.ranks[2].income} <:lz_fish:742459590087803010>`,
                                        inline: false
                                    },
                                    {
                                        name: `4. ${curWork.ranks[3].name}`,
                                        value: `Доход: ${curWork.ranks[3].income} <:lz_fish:742459590087803010>`,
                                        inline: false
                                    },
                                    {
                                        name: `5. ${curWork.ranks[4].name}`,
                                        value: `Доход: ${curWork.ranks[4].income} <:lz_fish:742459590087803010>`,
                                        inline: false
                                    },
                                    {
                                        name: `6. ${curWork.ranks[5].name}`,
                                        value: `Доход: ${curWork.ranks[5].income} <:lz_fish:742459590087803010>`,
                                        inline: false
                                    }
                                ],
                                timestamp: new Date(),
                                footer: {
                                    text: `${user.tag}`,
                                    icon_url: `${user.displayAvatarURL()}`,
                                }
                            }
                        ]
                    }
                }
            });
        }
        if(whattoDo == "устроиться"){
            if(interaction.data.options[0].options[0].value < 1 || interaction.data.options[0].options[0].value > 3){
                return client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            flags: 64,
                            content: `Укажите корректный номер работы.`
                        }
                    }
                });
            }
            if(userdb.work_current != ''){
                return client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            flags: 64,
                            content: `Сначала увольтесь с текущей работы — /работа уволиться.`
                        }
                    }
                });
            }
            let workID = interaction.data.options[0].options[0].value - 1;
            var prevWork = "";
            if(workID != 0){
                var razn = workID - 1;
                prevWork = works[razn].codename;
            }
            if(userdb.work_previous != prevWork){
                return client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            flags: 64,
                            content: `Вам необходимо получить все ранги на работе ${works[razn].name}.`
                        }
                    }
                });
            }
            client.db.change(interaction.member.user.id, 'users', 'work_current', works[workID].codename)
            client.db.change(interaction.member.user.id, 'users', 'work_currentXP', 0)
            client.db.change(interaction.member.user.id, 'users', 'work_rank', 0)
            return client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        embeds: [
                            {
                                color: 0xb88fff,
                                title: 'Успешно',
                                description: `Вы устроились на работу — ${works[workID].name}. Ваш текущий ранг: ${works[workID].ranks[0].name}`,
                                timestamp: new Date(),
                                footer: {
                                    text: `${user.tag}`,
                                    icon_url: `${user.displayAvatarURL()}`,
                                }
                            }
                        ]
                    }
                }
            });
        }
        if(whattoDo == "уволиться"){
            if(userdb.work_current == ''){
                return client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            flags: 64,
                            content: `У вас нет работы.`
                        }
                    }
                });
            }
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
            client.db.change(interaction.member.user.id, 'users', 'work_current', "")
            client.db.change(interaction.member.user.id, 'users', 'work_currentXP', 0)
            client.db.change(interaction.member.user.id, 'users', 'work_rank', 0)
            return client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        embeds: [
                            {
                                color: 0xb88fff,
                                title: 'Успешно',
                                description: `Вы уволились с текущей работы — ${curWork.name}. ${toAdd}`,
                                timestamp: new Date(),
                                footer: {
                                    text: `${user.tag}`,
                                    icon_url: `${user.displayAvatarURL()}`,
                                }
                            }
                        ]
                    }
                }
            });
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
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            embeds: [
                                {
                                    color: 0xb88fff,
                                    title: 'Работа',
                                    description: `Напишите любое **${chetType} ${taskZnak}-х значное** число.`,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${user.tag} • У вас 10 секунд. Отправьте сообщение с числом.`,
                                        icon_url: `${user.displayAvatarURL()}`,
                                    }
                                }
                            ]
                        }
                    }
                });
                try{
                    response = await channel.awaitMessages((message2) => interaction.member.user.id === message2.author.id, {
                        max: 1,
                        time: 10000,
                        errors: ['time']
                    });
                }catch(error){
                    var toAddErr = ``
                    if(userdb.work_currentXP != 0){
                        client.db.change(interaction.member.user.id, 'users', 'work_currentXP', (userdb.work_currentXP - 1))
                        toAddErr = `Вы потеряли 1 XP.`;
                    }
                    return client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
                        data: {
                            type: 4,
                              embeds: [{
                                color: 0xb88fff,
                                title: "Работа: ошибка",
                                description: `Время истекло. ${toAddErr}`,
                                timestamp: new Date(),
                                footer: {
                                    text: `${user.tag}`,
                                    icon_url: `${user.displayAvatarURL()}`,
                                }
                              }]
                        }
                    });
                }
                let check = Number(response.first().content) % 2;
                if (taskZnak == response.first().content.toString().length && taskChet == check) {
		            let wonXP = randomInt(1, 2);
                    client.db.change(interaction.member.user.id, 'users', 'work_currentXP', (userdb.work_currentXP + wonXP))
                    client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + curWork.ranks[curRank].income))
                    let checkNextRank = userdb.work_rank + 1;
                    var toAdd = ``;
                    if (curWork.ranks[checkNextRank]) {
                    if(userdb.work_currentXP > curWork.ranks[checkNextRank].requiredXP){
                        client.db.change(interaction.member.user.id, 'users', 'work_rank', (userdb.work_rank + 1))
                        toAdd = `\n**У вас новый ранг: ${curWork.ranks[checkNextRank].name}**`;
                    }
					}
		            return client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
			            data: {
				            type: 4,
			  	            embeds: [{
					            color: 0xb88fff,
					            title: "Работа: успешно",
					            description: `Вы выполнили задание.\nПолучено ${wonXP} XP и ${curWork.ranks[curRank].income} <:lz_fish:742459590087803010>.${toAdd}`,
					            timestamp: new Date(),
					            footer: {
						            text: `${user.tag}`,
						            icon_url: `${user.displayAvatarURL()}`,
					            }
			  	            }]
			            }
		            });
                }else{
                    var toAddErr = ``
                    if(userdb.work_currentXP != 0){
                        client.db.change(interaction.member.user.id, 'users', 'work_currentXP', (userdb.work_currentXP - 1))
                        toAddErr = `Вы потеряли 1 XP.`
                        if(userdb.balance_fish > curWork.ranks[curRank].income){
                            client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish - curWork.ranks[curRank].income))
                            toAddErr = `Вы потеряли 1 XP и ${curWork.ranks[curRank].income} <:lz_fish:742459590087803010>.`;
                        }
                        
                    }
                    return client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
                        data: {
                            type: 4,
                              embeds: [{
                                color: 0xb88fff,
                                title: "Работа: ошибка",
                                description: `Допущена ошибка. ${toAddErr}`,
                                timestamp: new Date(),
                                footer: {
                                    text: `${user.tag}`,
                                    icon_url: `${user.displayAvatarURL()}`,
                                }
                              }]
                        }
                    });
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
                
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            embeds: [
                                {
                                    color: 0xb88fff,
                                    title: 'Работа',
                                    description: `Напишите наибольшее число: **${firstNum}**, **${secondNum}**, **${thirdNum}**.`,
                                    timestamp: new Date(),
                                    footer: {
                                        text: `${user.tag} • У вас 10 секунд. Отправьте сообщение с числом.`,
                                        icon_url: `${user.displayAvatarURL()}`,
                                    }
                                }
                            ]
                        }
                    }
                });
                try{
                    response = await channel.awaitMessages((message2) => interaction.member.user.id === message2.author.id, {
                        max: 1,
                        time: 10000,
                        errors: ['time']
                    });
                }catch(error){
                    var toAddErr = ``
                    if(userdb.work_currentXP != 0){
                        client.db.change(interaction.member.user.id, 'users', 'work_currentXP', (userdb.work_currentXP - 1))
                        toAddErr = `Вы потеряли 1 XP.`;
                    }
                    return client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
                        data: {
                            type: 4,
                              embeds: [{
                                color: 0xb88fff,
                                title: "Работа: ошибка",
                                description: `Время истекло. ${toAddErr}`,
                                timestamp: new Date(),
                                footer: {
                                    text: `${user.tag}`,
                                    icon_url: `${user.displayAvatarURL()}`,
                                }
                              }]
                        }
                    });
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
                    client.db.change(interaction.member.user.id, 'users', 'work_currentXP', (userdb.work_currentXP + wonXP))
                    client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish + curWork.ranks[curRank].income))
                    let checkNextRank = userdb.work_rank + 1;
                    var toAdd = ``;
                    if(userdb.work_currentXP > curWork.ranks[checkNextRank].requiredXP){
                        client.db.change(interaction.member.user.id, 'users', 'work_rank', (userdb.work_rank + 1))
                        toAdd = `\n**У вас новый ранг: ${curWork.ranks[checkNextRank].name}**`;
                    }
		            return client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
			            data: {
				            type: 4,
			  	            embeds: [{
					            color: 0xb88fff,
					            title: "Работа: успешно",
					            description: `Вы выполнили задание.\nПолучено ${wonXP} XP и ${curWork.ranks[curRank].income} <:lz_fish:742459590087803010>.${toAdd}`,
					            timestamp: new Date(),
					            footer: {
						            text: `${user.tag}`,
						            icon_url: `${user.displayAvatarURL()}`,
					            }
			  	            }]
			            }
		            });
                }else{
                    var toAddErr = ``
                    if(userdb.work_currentXP != 0){
                        client.db.change(interaction.member.user.id, 'users', 'work_currentXP', (userdb.work_currentXP - 1))
                        toAddErr = `Вы потеряли 1 XP.`
                        if(userdb.balance_fish > curWork.ranks[curRank].income){
                            client.db.change(interaction.member.user.id, 'users', 'balance_fish', (userdb.balance_fish - curWork.ranks[curRank].income))
                            toAddErr = `Вы потеряли 1 XP и ${curWork.ranks[curRank].income} <:lz_fish:742459590087803010>.`;
                        }
                        
                    }
                    return client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
                        data: {
                            type: 4,
                              embeds: [{
                                color: 0xb88fff,
                                title: "Работа: ошибка",
                                description: `Допущена ошибка. ${toAddErr}`,
                                timestamp: new Date(),
                                footer: {
                                    text: `${user.tag}`,
                                    icon_url: `${user.displayAvatarURL()}`,
                                }
                              }]
                        }
                    });
                }
            }
        }
    }catch(error){
        client.logger.log(`${error}`, "err");
        console.log(error);
    }
};

module.exports.help = {
    name: "работа",
	aliases: ["hf,jnf"],
	permissions: ["member"],
	modules: ["economy"]
};