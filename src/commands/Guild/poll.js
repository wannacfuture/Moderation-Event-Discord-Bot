// Dependencies
const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args, emojis, settings) => {
	if (message.deletable) message.delete();
	// Check bot for add reaction permission
	if (!message.guild.me.hasPermission('ADD_REACTIONS')) {
		message.channel.send({ embed:{ color:15158332, description:`${emojis[0]} I am missing the permission: \`ADD_REACTIONS\`.` } }).then(m => m.delete({ timeout: 10000 }));
		bot.logger.error(`Missing permission: \`ADD_REACTIONS\` in [${message.guild.id}]`);
		return;
	}
	// Make sure a poll was provided
	if (!args[0]) {
		message.channel.send({ embed:{ color:15158332, description:`${emojis[0]} Please use the format \`${bot.commands.get('poll').help.usage.replace('${PREFIX}', settings.prefix)}\`.` } }).then(m => m.delete({ timeout: 3000 }));
		return;
	}

	// Send poll to channel
	const embed = new MessageEmbed()
		.setColor(0xffffff)
		.setTitle(`Poll created by ${message.author.username}`)
		.setDescription(args.join(' '))
		.setFooter('React to vote..')
		.setTimestamp();
	const msg = await message.channel.send(embed);
	// Add reactions to message
	await msg.react('✅');
	await msg.react('❌');
};

module.exports.config = {
	command: 'poll',
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
};

module.exports.help = {
	name: 'Poll',
	category: 'Guild',
	description: 'Create a poll for users to answer.',
	usage: '${PREFIX}poll <question>',
	example: '${PREFIX}poll is Egglord the best?',
};
