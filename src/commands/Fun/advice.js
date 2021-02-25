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
			cooldown: 3000,
		});
	}

	// Run command
	async run(bot, message, args, settings) {
		try {
			const data = await fetch('https://api.adviceslip.com/advice').then(res => res.json());
			message.channel.send({ embed: { color: 'RANDOM', description: data.slip.advice } });
		} catch (err) {
			if (bot.config.debug) bot.logger.error(`${err.message} - command: advice.`);
			message.error(settings.Language, 'ERROR_MESSAGE').then(m => m.delete({ timeout: 5000 }));
			if (message.deletable) message.delete();
		}
	}
};
