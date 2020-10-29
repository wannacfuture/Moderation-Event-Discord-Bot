module.exports.run = async (bot, message, args, emojis, settings) => {
	// check for bot permissions, song/playlist ( and if needed DJ role)
	if (!bot.musicHandler(message, args, emojis, settings)) {
		return;
	}
};
module.exports.config = {
	command: 'play-file',
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'SPEAK'],
};
module.exports.help = {
	name: 'radio',
	category: 'Music',
	description: 'Play a file.',
	usage: '${PREFIX}play <file>',
};
