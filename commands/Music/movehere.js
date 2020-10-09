module.exports.run = async (bot, message, args, emojis, settings, ops) => {
	if (message.deletable) message.delete();
	// Move the bot to a new voice channel
	// Make sure user can move the bot
	if (!message.member.hasPermission('MOVE_MEMBERS')) {
		message.channel.send({ embed:{ color:15158332, description:`${emojis[0]} You are missing the permission: \`MOVE_MEMBERS\`.` } }).then(m => m.delete({ timeout: 10000 }));
		return;
	}
	// get channel and data info
	const channel = message.guild.channels.cache.find(c => c.id == args[0]);
	const data = ops.active.get(message.guild.id);

	// Make sure there are song playing
	if (!data) return message.channel.send({ embed:{ color:15158332, description:`${emojis[0]} There are currently no songs playing in this server.` } }).then(m => m.delete({ timeout: 5000 }));

	// Find what channel to join
	if (channel && channel.type == 'voice') {
		data.connection = await channel.join();
	} else if (message.member.voiceChannel) {
		// Join the voice channel and update data file
		data.connection = await message.member.voice.channel.join();
	} else {
		// no channel found - send error message
		message.channel.send({ embed:{ color:15158332, description:`${emojis[0]} Please use the format \`${bot.commands.get('movehere').help.usage.replace('${PREFIX}', settings.prefix)}\`.` } }).then(m => m.delete({ timeout: 5000 }));
		return;
	}
};

module.exports.config = {
	command: 'movehere',
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
};

module.exports.help = {
	name: 'Movehere',
	category: 'Music',
	description: 'Move the bot to a different voice channel.',
	usage: '${PREFIX}movehere [channel]',
};
