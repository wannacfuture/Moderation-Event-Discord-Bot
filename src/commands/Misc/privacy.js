// Dependencies
const Command = require('../../structures/Command.js');

module.exports = class Privacy extends Command {
	constructor(bot) {
		super(bot, {
			name: 'privacy',
			dirname: __dirname,
			aliases: ['priv'],
			botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Sends a link to the privacy policy.',
			usage: 'privacy',
			cooldown: 3000,
		});
	}

	// Run command
	async run(bot, message, args, settings) {
		// Send link to privacy policy
		message.channel.send({ embed:{ description:`[${message.translate(settings.Language, 'MISC/PRIVACY_POLICY')}](https://github.com/Spiderjockey02/Discord-Bot/blob/master/docs/PRIVACY.md)` } });
	}
};
