const { MessageEmbed, CommandInteractionOptionResolver } = require("discord.js"); 
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
module.exports.run = async (client, message, args) => {
	try {
	/*
	const qiwiApi = new QiwiBillPaymentsAPI(client.config.qiwiSecretKey);
	if(args[0] == "купить"){
		if(users[message.author.id].bills == 1){
			let billIDCheck = `LZ-${message.author.id}-${users[message.author.id].billID}`;
			qiwiApi.getBillInfo(billIDCheck).then(data => {
    			if(data.status.value == "WAITING"){
					let purchaseWait = new MessageEmbed()
						.setTitle("Покупка")
						.setColor(`${chats[message.guild.id].color}`)
						.setDescription("Для получения Premium-статуса оплатите счёт по указанной ссылке и отправьте команду /премиум купить")
						.addField(`Предмет:`, `Premium-статус на 30 дней`, true)
						.addField(`Пользователь:`, `${message.author.tag}`, true)
						.addField(`К оплате:`, `49 ₽`, false)
						.addField(`Ссылка для оплаты:`, `[клик](${data.payUrl})`, false)
						.setTimestamp()
						.setFooter(`${stats.version}`, client.user.avatarURL());
					message.channel.send(purchaseWait);
				}
				if(data.status.value == "PAID"){
					let purchaseSuccess = new MessageEmbed()
						.setTitle("Покупка: успешно")
						.setColor(`${chats[message.guild.id].color}`)
						.setDescription("Благодарим за пожертвование!")
						.addField(`Выдан предмет:`, `Premium-статус на 30 дней`, true)
						.addField(`Пользователь:`, `${message.author.tag}`, false)
						.setTimestamp()
						.setFooter(`${stats.version}`, client.user.avatarURL());
					users[message.author.id].bills = 0;
					users[message.author.id].billID += 1;
					users[message.author.id].cripty = "активен"
					fs.writeFileSync("C:\\Users\\danma\\Documents\\dminc\\bots\\lazycatnew\\base\\users.json", JSON.stringify(users, null, "\t"));
					message.channel.send(purchaseSuccess);
				}
				if(data.status.value == "EXPIRED"){
					users[message.author.id].bills = 0;
					users[message.author.id].billID += 1;
					fs.writeFileSync("C:\\Users\\danma\\Documents\\dminc\\bots\\lazycatnew\\base\\users.json", JSON.stringify(users, null, "\t"));
				}
				if(data.status.value == "REJECTED"){
					users[message.author.id].bills = 0;
					users[message.author.id].billID += 1;
					fs.writeFileSync("C:\\Users\\danma\\Documents\\dminc\\bots\\lazycatnew\\base\\users.json", JSON.stringify(users, null, "\t"));
				}
			});
			return;
		}
		if(users[message.author.id].bills == 0)
			users[message.author.id].bills = 1;
		fs.writeFileSync("C:\\Users\\danma\\Documents\\dminc\\bots\\lazycatnew\\base\\users.json", JSON.stringify(users, null, "\t"));
		let dat = new Date();
		dat.setMonth(dat.getMonth() + 1);
		let year = dat.getFullYear();
		let month = Number(dat.getMonth()) + 1;
		month = ('0' + month).slice(-2);
		let day = ('0' + dat.getDate()).slice(-2);
		let hour = Number(dat.getHours()) + 5;
		hour = ('0' + hour).slice(-2);
		let minute = ('0' + dat.getMinutes()).slice(-2);
		let second = ('0' + dat.getSeconds()).slice(-2);
		const billID = `LZ-${message.author.id}-${users[message.author.id].billID}`;
		const fields = {
			amount: 1.00,
			currency: 'RUB',
			comment: `Пожертвование для Lazy Cat (${message.author.tag})`,
			customFields: {themeCode: 'Danyyl-NpiSKdAauu'},
			expirationDateTime: `${year}-${month}-${day}T${hour}:${minute}:${second}+03:00`
		};
		qiwiApi.createBill(billID, fields).then(data => {
			let purchaseWaiting = new MessageEmbed()
				.setColor(`${chats[message.guild.id].color}`)
				.setTitle("Покупка")
				.setDescription("Для получения Premium-статуса совершите пожертвование по указанной ссылке и отправьте команду /премиум купить")
				.addField(`Предмет:`, `Premium-статус на 30 дней`, true)
				.addField(`Пользователь:`, `${message.author.tag}`, true)
				.addField(`К оплате:`, `49 ₽`, false)
				.addField(`Ссылка для оплаты:`, `[клик](${data.payUrl})`, false)
				.setTimestamp()
				.setFooter(`${stats.version}`, client.user.avatarURL());
			return message.channel.send(purchaseWaiting);
		});
		return;
	}*/
	let userdb = await client.db.getUser(message.author.id)
	if(userdb.premium_has == 'true'){
		var premiumStatus = `активен`
	}else{
		var premiumStatus = `неактивен`
	}
	let embed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle("Премиум-статус")
			.setDescription(`<:lz_premium:742033865761095751> Премиум — это возможность поддержать работу Lazy Cat.\n
			Всё очень просто: вы спонсируете нас материально — взамен мы предлагаем следующие функции:\n
			— Музыкальный плагин
			— Значок в профиле (/профиль)
			— Специальная роль на нашем Сервере Поддержки (@Premium)
    		— Настраиваемый фон и цвета карточки для участников вашего сервера (/ранг)
			— Выдача ролей на вашем сервере за достижение определённого уровня
			— Уникальные предметы (/магазин)
			
			На данный момент покупка Премиум временно недоступна.\n
			Ваш Премиум-статус: ${premiumStatus}`)
			.setTimestamp()
			.setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic: true}) });
		message.channel.send({embeds: [embed]});
	} catch (error) {
		client.logger.log(error, 'err')
		console.error(error)
		message.channel.send({ content: `Произошла ошибка при выполнении команды.`})
	}
}

module.exports.data = {
	name: "премиум",
	permissions: ["developer"],
	type: "message"
}