// Dependencies
const	Command = require('../../structures/Command.js');

module.exports = class Reload extends Command {
	constructor(bot) {
		super(bot, {
			name: 'reload',
			ownerOnly: true,
			dirname: __dirname,
			botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Reloads a command.',
			usage: 'reload <command>',
			cooldown: 3000,
		});
	}

	// Run command
	async run(bot, message, args, settings) {
		// delete message
		if (message.deletable) message.delete();

		// Checks to see if a command was specified
		if (!args[0]) return message.error(settings.Language, 'INCORRECT_FORMAT', settings.prefix.concat(this.help.usage)).then(m => m.delete({ timeout: 5000 }));

		// checks to make sure command exists
		const commandName = args[0].toLowerCase();
		if (bot.commands.has(commandName) || bot.commands.get(bot.aliases.get(commandName))) {
			// Finds command
			const command = bot.commands.get(commandName) || bot.commands.get(bot.aliases.get(commandName));

			// reloads command
			try {
				delete require.cache[require.resolve(`../${command.help.category}/${commandName}.js`)];
				bot.commands.delete(commandName);
				const pull = require(`../${command.help.category}/${commandName}.js`);
				bot.commands.set(commandName, pull);
				message.success(settings.Language, 'HOST/RELOAD_SUCCESS', commandName).then(m => m.delete({ timeout: 8000 }));
				bot.logger.log(`Reloaded Command: ${commandName}.js`);
			} catch(err) {
				if (bot.config.debug) bot.logger.error(`${err.message} - command: reload.`);
				return message.error(settings.Language, 'HOST/RELOAD_ERROR', commandName).then(m => m.delete({ timeout: 10000 }));
			}
		} else {
			return message.error(settings.Language, 'HOST/RELOAD_NO_COMMAND', commandName).then(m => m.delete({ timeout: 10000 }));
		}
	}
};
