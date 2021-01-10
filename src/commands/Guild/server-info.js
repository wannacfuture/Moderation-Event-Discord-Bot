// Dependencies
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports.run = async (bot, message, args, settings) => {
	// Send server information
	const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).array();
	while (roles.join(', ').length >= 1021) {
		roles.pop();
	}
	const member = message.guild.members.cache;
	const embed = new MessageEmbed()
		.setAuthor(`${message.guild.name}'s server info`, message.guild.iconURL())
		.setColor(3447003)
		.setThumbnail(message.guild.iconURL())
		.addField(message.translate(settings.Language, 'GUILD/GUILD_NAME'), `\`${message.guild.name}\``, true)
		.addField(message.translate(settings.Language, 'GUILD/GUILD_OWNER'), `\`${message.guild.owner.user.tag}\``, true)
		.addField(message.translate(settings.Language, 'GUILD/GUILD_ID'), `\`${message.guild.id}\``, true)
		.addField(message.translate(settings.Language, 'GUILD/GUILD_CREATED'), `\`${moment(message.guild.createdAt).format('MMMM Do YYYY')}\``, true)
		.addField(message.translate(settings.Language, 'GUILD/GUILD_REGION'), `\`${message.guild.region}\``, true)
		.addField(message.translate(settings.Language, 'GUILD/GUILD_VERIFICATION'), `\`${message.guild.verificationLevel}\``, true)
		.addField(message.translate(settings.Language, 'GUILD/GUILD_MEMBER', message.guild.memberCount), `\`${(member.filter(m => m.presence.status === 'online').size)} online, ${(member.filter(m => m.presence.status === 'idle').size)} idle and ${(member.filter(m => m.presence.status === 'dnd').size)} DnD \n${member.filter(m => m.user.bot).size} bots, ${member.filter(m => !m.user.bot).size} humans\``, true)
		.addField(message.translate(settings.Language, 'GUILD/GUILD_FEATURES'), `\`${(message.guild.features.length == 0) ? 'None' : message.guild.features.toString().toLowerCase().replace(/,/g, ', ')}\``, true)
		.addField(message.translate(settings.Language, 'GUILD/GUILD_ROLES', message.guild.roles.cache.size), `${roles.join(', ')}${(roles.length != message.guild.roles.cache.sort((a, b) => b.position - a.position).array().length) ? '...' : '.'}`)
		.setTimestamp()
		.setFooter(message.translate(settings.Language, 'GUILD/INFO_FOOTER', message.author.tag));
	message.channel.send(embed);
};

module.exports.config = {
	command: 'server-info',
	aliases: ['serverinfo', 'guildinfo'],
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
};

module.exports.help = {
	name: 'Server info',
	category: 'Guild',
	description: 'Get information on the server.',
	usage: '${PREFIX}server-info',
};
