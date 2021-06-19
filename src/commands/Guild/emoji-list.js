// Dependencies
const	Command = require('../../structures/Command.js');

module.exports = class EmojiList extends Command {
	constructor(bot) {
		super(bot, {
			name: 'emoji-list',
			guildOnly: true,
			dirname: __dirname,
			aliases: ['emojilist', 'emotes'],
			botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Displays the server\'s emojis',
			usage: 'emojilist',
			cooldown: 2000,
			slash: true,
		});
	}

	// Function for message command
	async run(bot, message) {
		message.channel.send(message.translate('guild/emoji-list:MESSAGE', { GUILD: message.guild.name, EMOJIS: message.guild.emojis.cache.map(e => e.toString()).join(' ') }));
	}

	// Function for slash command
	async callback(bot, interaction, guild) {
		bot.send(interaction, { content: bot.translate('guild/emoji-list:MESSAGE', { GUILD: guild.name, EMOJIS: guild.emojis.cache.map(e => e.toString()).join(' ') }) });
	}
};
