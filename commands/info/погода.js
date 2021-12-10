const weather = require('openweather-apis');
module.exports.run = async (client, interaction) => {
	try{
		let user = client.users.cache.get(interaction.member.user.id);
		weather.setAPPID('06e6a1224c53e468f618b7497088a742');
		weather.setLang('ru');
		weather.setUnits('metric');		
		weather.setCity(interaction.data.options[0].value);
		weather.getAllWeather(function(err, response){
			if(err) {
				return client.api.interactions(interaction.id, interaction.token).callback.post({
							data: {
								type: 4,
								data: {
									flags: 64,
									content: "Укажите корректное местоположение."
								}
							}
						});
			}
			let shift = response.timezone / 60;
			shift = shift / 60;
			if(shift > 0){
				var sign = '+';
			}else{
				var sign = '';
			};
			let currentTemp = Math.floor(response.main.temp);
			let feelsLike = Math.floor(response.main.feels_like);
			return client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						embeds: [
							{
								color: 0xb88fff,
								timestamp: new Date(),
								thumbnail: {
									url: `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
								},
								title: `Погода: ${response.name}`,
								fields: [
									{
										name: 'Часовой пояс:',
										value: `UTC${sign}${shift}`,
										inline: false,
									},
									{
										name: 'Температура:',
										value: `${currentTemp}°C`,
										inline: true,
									},
									{
										name: 'Погода:',
										value: `${response.weather[0].description}`,
										inline: true,
									},
									{
										name: 'Ветер:',
										value: `${response.wind.speed} м/с`,
										inline: true,
									},
									{
										name: 'Ощущается как:',
										value: `${feelsLike}°C`,
										inline: true,
									},
									{
										name: 'Влажность:',
										value: `${response.main.humidity}%`,
										inline: true,
									},
									{
										name: 'Облачность:',
										value: `${response.clouds.all}%`,
										inline: true,
									},
								],
								footer: {
									text: `${user.tag}`,
									icon_url: `${user.displayAvatarURL()}`,
								}
							}
						]
					}
				}
			});
		});
	
	}catch(error){
		client.logger.log(`${error}`, "err");
		}
}

module.exports.help = {
	name: "погода",
	aliases: ["gjujlf"],
	permissions: ["member"],
	modules: ["info"]
}