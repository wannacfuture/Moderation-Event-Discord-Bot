// Dependecies
const Command = require('../../structures/Command.js');

module.exports = class SetModeration extends Command {
	constructor(bot) {
		super(bot, {
			command: 'set-moderation',
			dirname: __dirname,
			aliases: ['setmod', 'setmoderation'],
			botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Turn on or off the moderation plugin.',
			usage: 'set-moderation <true | false>',
			cooldown: 3000,
		});
	}

	// Run command
	async run(bot, message, args, settings) {
		// Delete message
		if (settings.ModerationClearToggle & message.deletable) message.delete();

		// Make sure user can edit server plugins
		if (!message.member.hasPermission('MANAGE_GUILD')) return message.error(settings.Language, 'USER_PERMISSION', 'MANAGE_GUILD').then(m => m.delete({ timeout: 10000 }));

		// update moderation plugin
		try {
			if (args[0] == 'true') {
				await message.guild.updateGuild({ ModerationPlugin: true });
				message.success(settings.Language, 'PLUGINS/MODERATION_SET', args[0]).then(m => m.delete({ timeout:10000 }));
			} else if (args[0] == 'false') {
				await message.guild.updateGuild({ ModerationPlugin: false });
				message.success(settings.Language, 'PLUGINS/MODERATION_SET', args[0]).then(m => m.delete({ timeout:10000 }));
			} else {
				return message.error(settings.Language, 'INCORRECT_FORMAT', settings.prefix.concat(this.help.usage)).then(m => m.delete({ timeout: 5000 }));
			}
		} catch (e) {
			console.log(e);
			return message.error(settings.Language, 'ERROR_MESSAGE');
		}
	}
};
