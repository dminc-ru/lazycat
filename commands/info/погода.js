const weather = require('openweather-apis');
module.exports.run = async (client, interaction) => {
	try {
		let noUser = client.utils.error('Пользователь не найден в базе данных.')
		try {
			var user = await client.users.fetch(interaction.member.user.id);
		} catch (error) {
			return message.channel.send({embeds: [noUser]})
		}
		weather.setAPPID(client.config.weatherID);
		weather.setLang('ru');
		weather.setUnits('metric');		
		weather.setCity(interaction.options.getString('местоположение'));
		weather.getAllWeather(function(err, response){
			if(err)
				return interaction.reply({content: "Укажите корректное местоположение.", ephemeral: true})
			let shift = response.timezone / 60;
			shift = shift / 60;
			if(shift > 0){
				var sign = '+';
			}else{
				var sign = '';
			};
			let currentTemp = Math.floor(response.main.temp);
			let feelsLike = Math.floor(response.main.feels_like);
			let weatherEmbed = client.utils.embed(`Погода: ${response.name}`, undefined, user)
				.setThumbnail(`http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
				.addField(`Часовой пояс:`, `UTS${sign}${shift}`, false)
				.addField('Температура:', `${currentTemp}°C`, true)
				.addField('Погода', response.weather[0].description, true)
				.addField('Ветер:', `${response.wind.speed} м/с`, true)
				.addField('Ощущается как:', `${feelsLike}°C`, true)
				.addField('Влажность:', `${response.main.humidity}%`, true)
				.addField('Облачность:', `${response.clouds.all}%`, true)
			return interaction.reply({embeds: [weatherEmbed]})
		});
	} catch (error) {
		client.logger.log(error, 'err')
		console.error(error)
		interaction.reply({content: `Произошла ошибка при выполнении команды.`, ephemeral: true})
	}
}

module.exports.data = {
	name: "погода",
	permissions: ["member"],
	type: "interaction"
}