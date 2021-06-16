// Dependencies
const Command = require('../../structures/Command.js');

module.exports = class Invite extends Command {
	constructor(bot) {
		super(bot, {
			name: 'invite',
			dirname: __dirname,
			aliases: ['inv'],
			botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Send an invite link so people can add me to their server.',
			usage: 'invite',
			cooldown: 2000,
			slash: true,
		});
	}

	// Run command
	async run(bot, message) {
		message.channel.send({ embed:{ description:message.translate('misc/invite:LINK', { LINK: bot.config.inviteLink }) } });
	}

	//Run slash command
	async callback(bot, interaction, guild, member, args) {
		return await bot.send(interaction, [{ description:bot.translate('misc/invite:LINK', { LINK: bot.config.inviteLink }) }] )
	}
};
