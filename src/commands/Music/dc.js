// Dependencies
const Command = require('../../structures/Command.js');

module.exports = class Disconnect extends Command {
	constructor(bot) {
		super(bot, {
			name: 'dc',
			dirname: __dirname,
			aliases: ['stop', 'disconnect'],
			botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Disconnects the bot from the voice channel.',
			usage: 'dc',
			cooldown: 3000,
		});
	}

	// Run command
	async run(bot, message, args, settings) {
		// Check that a song is being played
		const player = bot.manager.players.get(message.guild.id);
		if (!player) return message.error(settings.Language, 'MUSIC/NO_QUEUE').then(m => m.delete({ timeout: 5000 }));

		// Check that user is in the same voice channel
		if (message.member.voice.channel.id !== player.voiceChannel) return message.error(settings.Language, 'MUSIC/NOT_VOICE').then(m => m.delete({ timeout: 5000 }));

		// Destory player (clears queue & leaves channel)
		player.destroy();
		return message.success(settings.Language, 'MUSIC/LEFT_VOICE');
	}
};
