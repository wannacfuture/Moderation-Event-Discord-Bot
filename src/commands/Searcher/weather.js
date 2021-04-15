// Dependencies
const { find } = require('weather-js'),
	{ MessageEmbed } = require('discord.js'),
	Command = require('../../structures/Command.js');

module.exports = class Weather extends Command {
	constructor(bot) {
		super(bot, {
			name: 'weather',
			dirname: __dirname,
			aliases: ['fort', 'fortnight'],
			botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Look up the weather in a certain area.',
			usage: 'weather <location>',
			cooldown: 3000,
			examples: ['weather england', 'weather new york'],
		});
	}

	// Run command
	async run(bot, message, settings) {
		if (!message.args[0]) return message.channel.error(settings.Language, 'INCORRECT_FORMAT', settings.prefix.concat(this.help.usage)).then(m => m.delete({ timeout: 5000 }));
		// search up weather stats
		find({ search: message.args.join(' '), degreeType: 'C' }, function(err, result) {
			try {
				const embed = new MessageEmbed()
					.setTitle(bot.translate(settings.Language, 'SEARCHER/WEATHER_TITLE', result[0].location.name))
					.setDescription(bot.translate(settings.Language, 'SEARCHER/WEATHER_DESCRIPTION'))
					.addField(bot.translate(settings.Language, 'SEARCHER/WEATHER_TEMP'), `${result[0].current.temperature}°C`, true)
					.addField(bot.translate(settings.Language, 'SEARCHER/WEATHER_SKY'), result[0].current.skytext, true)
					.addField(bot.translate(settings.Language, 'SEARCHER/WEATHER_HUMIDITY'), `${result[0].current.humidity}%`, true)
					.addField(bot.translate(settings.Language, 'SEARCHER/WEATHER_SPEED'), result[0].current.windspeed, true)
					.addField(bot.translate(settings.Language, 'SEARCHER/WEATHER_TIME'), result[0].current.observationtime, true)
					.addField(bot.translate(settings.Language, 'SEARCHER/WEATHER_DISPLAY'), result[0].current.winddisplay, true)
					.setThumbnail(result[0].current.imageUrl);
				message.channel.send(embed);
			} catch(err) {
				if (message.deletable) message.delete();
				bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
				message.channel.error(settings.Language, 'ERROR_MESSAGE', err.message).then(m => m.delete({ timeout: 5000 }));
			}
		});
	}
};
