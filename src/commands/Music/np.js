// Dependecies
const { MessageEmbed } = require('discord.js'),
	createBar = require('string-progressbar'),
	Command = require('../../structures/Command.js');

module.exports = class NowPlaying extends Command {
	constructor(bot) {
		super(bot, {
			name: 'np',
			dirname: __dirname,
			aliases: ['song'],
			botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Shows the current song playing.',
			usage: 'np',
			cooldown: 3000,
		});
	}

	// Run command
	async run(bot, message, args, settings) {
		// Check that a song is being played
		const player = bot.manager.players.get(message.guild.id);
		if (!player) return message.error(settings.Language, 'MUSIC/NO_QUEUE').then(m => m.delete({ timeout: 5000 }));

		// Get current song information
		const { title, requester, thumbnail, uri, duration } = player.queue.current;
		const end = (duration > 6.048e+8) ? '🔴 LIVE' : new Date(duration).toISOString().slice(11, 19);
		// Display current song information
		try {
			const embed = new MessageEmbed()
				.setAuthor('Now playing:')
				.setColor(message.member.displayHexColor)
				.setThumbnail(thumbnail)
				.setDescription(`[${title}](${uri}) [${message.guild.member(requester)}]`)
				.addField('\u200b', new Date(player.position).toISOString().slice(11, 19) + ' [' + createBar(duration > 6.048e+8 ? player.position : duration, player.position, 15)[0] + '] ' + end, false);
			message.channel.send(embed);
		} catch (err) {
			if (message.deletable) message.delete();
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			message.error(settings.Language, 'ERROR_MESSAGE').then(m => m.delete({ timeout: 5000 }));
		}
	}
};
