// Dependencies
const Command = require('../../structures/Command.js');

module.exports = class Clear extends Command {
	constructor(bot) {
		super(bot, {
			name: 'clear',
			guildOnly: true,
			dirname: __dirname,
			aliases: ['cl', 'purge'],
			userPermissions: ['MANAGE_MESSAGES'],
			botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES'],
			description: 'Clear a certain amount of messages.',
			usage: 'clear <Number> [member]',
			cooldown: 5000,
			examples: ['clear 50 username', 'clear 10'],
		});
	}

	// Run command
	async run(bot, message, settings) {
		// Delete message
		if (settings.ModerationClearToggle & message.deletable) message.delete();

		// Make sure user can delete messages themselves
		if (!message.channel.permissionsFor(message.author).has('MANAGE_MESSAGES')) return message.channel.error(settings.Language, 'USER_PERMISSION', 'MANAGE_MESSAGES').then(m => m.delete({ timeout: 10000 }));

		// Make sure bot can delete other peoples messages
		if (!message.channel.permissionsFor(bot.user).has('MANAGE_MESSAGES')) {
			bot.logger.error(`Missing permission: \`MANAGE_MESSAGES\` in [${message.guild.id}].`);
			return message.channel.error(settings.Language, 'MISSING_PERMISSION', 'MANAGE_MESSAGES').then(m => m.delete({ timeout: 10000 }));
		}

		// Make sure the bot can see other peoples' messages
		if (!message.channel.permissionsFor(bot.user).has('READ_MESSAGE_HISTORY')) {
			bot.logger.error(`Missing permission: \`READ_MESSAGE_HISTORY\` in [${message.guild.id}].`);
			return message.channel.error(settings.Language, 'MISSING_PERMISSION', 'READ_MESSAGE_HISTORY').then(m => m.delete({ timeout: 10000 }));
		}

		// Get number of messages to removed
		const amount = message.args[0];

		// Make something was entered after `!clear`
		if (!amount) return message.channel.error(settings.Language, 'INCORRECT_FORMAT', settings.prefix.concat(this.help.usage)).then(m => m.delete({ timeout: 5000 }));

		// Make sure x is a number
		if (isNaN(amount) || (amount > 100) || (amount < 1)) return message.channel.error(settings.Language, 'INCORRECT_FORMAT', settings.prefix.concat(this.help.usage)).then(m => m.delete({ timeout: 5000 }));


		// Delete messages
		await message.channel.messages.fetch({ limit: amount }).then(async messages => {
			// Delete user messages
			if (message.args[1]) {
				const member = message.getMember();
				messages = messages.filter((m) => m.author.id == member[0].user.id);
			}

			// delete the message
			await message.channel.bulkDelete(messages, true).catch(err => bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`));
			message.channel.success(settings.Language, 'MODERATION/MESSAGES_DELETED', messages.size).then(m => m.delete({ timeout: 3000 }));
		});
	}
};
