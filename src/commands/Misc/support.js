// Dependencies
const { Embed } = require('../../utils'),
	Command = require('../../structures/Command.js');

module.exports = class Support extends Command {
	constructor(bot) {
		super(bot, {
			name: 'support',
			dirname: __dirname,
			aliases: ['sup'],
			botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Get support on the bot.',
			usage: 'support',
			cooldown: 2000,
			slash: true,
		});
	}

	// Function for message command
	async run(bot, message) {
		const embed = new Embed(bot, message.guild)
			.setTitle('misc/support:TITLE', { USER: bot.user.username })
			.setDescription(bot.translate('misc/support:DESC', 	{ SUPPORT: bot.config.SupportServer.link, WEBSITE: bot.config.websiteURL }));
		message.channel.send({ embeds: [embed] });
	}

	// Function for slash command
	async callback(bot, interaction, guild) {
		const embed = new Embed(bot, guild)
			.setTitle('misc/support:TITLE', { USER: bot.user.username })
			.setDescription(bot.translate('misc/support:DESC', 	{ SUPPORT: bot.config.SupportServer.link, WEBSITE: bot.config.websiteURL }));
		return await bot.send(interaction, embed);
	}
};
