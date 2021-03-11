// Dependencies
const	Command = require('../../structures/Command.js');

module.exports = class Discrim extends Command {
	constructor(bot) {
		super(bot, {
			name: 'discrim',
			guildOnly: true,
			dirname: __dirname,
			aliases: ['discriminator'],
			botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Discrim',
			usage: 'discrim <discriminator>',
			cooldown: 2000,
			examples: ['discrim 6686'],
		});
	}

	// Run command
	async run(bot, message, args) {
		// Make sure a discriminator was entered
		if (!args[0]) return message.channel.send('');

		// Get all members with the correct discriminator
		const user = message.guild.members.cache.filter(m => m.user.discriminator === args[0]).map(m => m.user.tag);
		message.channel.send(user.join('\n '));
	}
};
