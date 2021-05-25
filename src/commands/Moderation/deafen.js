// Dependencies
const Command = require('../../structures/Command.js');

module.exports = class Deafen extends Command {
	constructor(bot) {
		super(bot, {
			name: 'deafen',
			guildOnly: true,
			dirname: __dirname,
			userPermissions: ['DEAFEN_MEMBERS'],
			botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS', 'DEAFEN_MEMBERS'],
			description: 'Deafen a user.',
			usage: 'deafen <user> [time]',
			cooldown: 2000,
			examples: ['deafen username', 'deafen username 5m'],
		});
	}

	// Run command
	async run(bot, message, settings) {
		// Delete message
		if (settings.ModerationClearToggle & message.deletable) message.delete();

		// Checks to make sure user is in the server
		const members = await message.getMember();

		// Make sure that the user is in a voice channel
		if (members[0]?.voice.channel) {
			// Make sure bot can deafen members
			if (!members[0].voice.channel.permissionsFor(bot.user).has('DEAFEN_MEMBERS')) {
				bot.logger.error(`Missing permission: \`DEAFEN_MEMBERS\` in [${message.guild.id}].`);
				return message.channel.error('misc:MISSING_PERMISSION', { PERMISSIONS: message.translate('permissions:DEAFEN_MEMBERS') }).then(m => m.delete({ timeout: 10000 }));
			}

			// Make sure user isn't trying to punish themselves
			if (members[0].user.id == message.author.id) return message.channel.error('misc:SELF_PUNISH').then(m => m.delete({ timeout: 10000 }));

			try {
				await members[0].voice.setDeaf(true);
				message.channel.success('moderation/deafen:SUCCESS', { USER: members[0].user }).then(m => m.delete({ timeout: 3000 }));
			} catch(err) {
				if (message.deletable) message.delete();
				bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
				message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }).then(m => m.delete({ timeout: 5000 }));
			}
		} else {
			message.channel.error('moderation/deafen:NOT_VC');
		}
	}
};
