// Dependencies
const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
	// Get avatar image of user
	let user = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
	if (!user) {
		user = message.guild.member(message.author);
	}
	const embed = new Discord.MessageEmbed()
		.setTitle(`Avatar for ${user.user.username}#${user.user.discriminator}`)
		.setDescription(`**Links:**\n[png](${user.user.displayAvatarURL({ format: 'png', size: 1024 })}) | [jpg](${user.user.displayAvatarURL({ format: 'jpg', size: 1024 })}) | [gif](${user.user.displayAvatarURL({ format: 'gif', size: 1024, dynamic: true })}) | [webp](${user.user.displayAvatarURL({ format: 'webp', size: 1024 })})`)
		.setImage(`${user.user.displayAvatarURL({ format: 'png', size: 256 })}`);
	message.channel.send(embed);
};

module.exports.config = {
	command: 'avatar',
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
};

module.exports.help = {
	name: 'Avatar',
	category: 'Guild',
	description: 'Displays user\'s avatar.',
	usage: '${PREFIX}avatar [user]',
};
