const { MessageEmbed } = require('discord.js')
const weather = require('openweather-apis');
module.exports.run = async (client, interaction) => {
		let user = client.users.cache.get(interaction.member.user.id);
		weather.setAPPID(client.config.weatherID);
		weather.setLang('ru');
		weather.setUnits('metric');		
		weather.setCity(interaction.data.options[0].value);
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
			let weatherEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setTitle(`Погода: ${response.name}`)
				.setThumbnail(`http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
				.addField(`Часовой пояс:`, `UTS${sign}${shift}`, false)
				.addField('Температура:', `${currentTemp}°C`, true)
				.addField('Погода', response.weather[0].description, true)
				.addField('Ветер:', `${response.wind.speed} м/с`, true)
				.addField('Ощущается как:', `${feelsLike}°C`, true)
				.addField('Влажность:', `${response.main.humidity}%`, true)
				.addField('Облачность:', `${response.clouds.all}%`, true)
				.setTimestamp()
				.setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
			return interaction.reply({embeds: [weatherEmbed]})
		});
}

module.exports.data = {
	name: "погода",
	permissions: ["member"],
	type: "interaction"
}