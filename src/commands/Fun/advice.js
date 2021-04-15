// Dependencies
const fetch = require('node-fetch'),
	Command = require('../../structures/Command.js');

module.exports = class Advice extends Command {
	constructor(bot) {
		super(bot, {
			name: 'advice',
			dirname: __dirname,
			botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Get some random advice',
			usage: 'advice',
			cooldown: 1000,
		});
	}

	// Run command
	async run(bot, message, settings) {
		try {
			const data = await fetch('https://api.adviceslip.com/advice').then(res => res.json());
			message.channel.send({ embed: { color: 'RANDOM', description: data.slip.advice } });
		} catch (err) {
			if (message.deletable) message.delete();
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			message.channel.error(settings.Language, 'ERROR_MESSAGE', err.message).then(m => m.delete({ timeout: 5000 }));
		}
	}
};
