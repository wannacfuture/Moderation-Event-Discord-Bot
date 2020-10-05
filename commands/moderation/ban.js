module.exports.run = async (bot, message, args, emoji) => {
	// Delete message
	if (message.deletable) message.delete();
	// Make sure user can ban users
	if (!message.member.hasPermission('BAN_MEMBERS')) {
		message.channel.send({ embed:{ color:15158332, description:`${emoji} You are missing the permission: \`BAN_MEMBERS\`.` } }).then(m => m.delete({ timeout: 10000 }));
		return;
	}
	// Check if bot has permission to ban user
	if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
		message.channel.send({ embed:{ color:15158332, description:`${emoji} I am missing the permission: \`BAN_MEMBERS\`.` } }).then(m => m.delete({ timeout: 10000 }));
		bot.logger.error(`Missing permission: \`BAN_MEMBERS\` in [${message.guild.id}].`);
		return;
	}
	// Get user and reason
	const banned = message.mentions.users.first() || bot.users.resolve(args[0]);
	const reason = (args.join(' ').slice(22)) ? args.join(' ').slice(22) : 'No reason given';
	// Make sure user is real
	if (!banned) {
		message.channel.send({ embed:{ color:15158332, description:`${emoji} I was unable to find this user.` } }).then(m => m.delete({ timeout: 10000 }));
		return;
	}
	// Ban user with reason
	try {
		message.guild.member(banned).ban({ reason: reason });
		message.channel.send({ embed:{ color:3066993, description:`${emoji} *${banned.username}#${banned.discriminator} was successfully banned*.` } }).then(m => m.delete({ timeout: 8000 }));
	} catch (err) {
		bot.logger.error(err.message);
		message.channel.send({ embed:{ color:15158332, description:`${emoji} An error occured when running this command, please try again or contact support.` } }).then(m => m.delete({ timeout: 10000 }));
	}
};

module.exports.config = {
	command: 'ban',
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
};

module.exports.help = {
	name: 'Ban',
	category: 'moderation',
	description: 'Ban a user.',
	usage: '${PREFIX}ban <user> [reason]',
};
