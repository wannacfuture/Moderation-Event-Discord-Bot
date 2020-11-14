// Dependencies
const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args, settings) => {
	// Get user
	const member = bot.GetUser(message, args);

	// send embed
	const embed = new MessageEmbed()
		.setTitle(message.translate(settings.Language, 'GUILD/AVATAR_TITLE', member.user.tag))
		.setDescription(`${message.translate(settings.Language, 'GUILD/AVATAR_DESCRIPTION')}\n[png](${member.user.displayAvatarURL({ format: 'png', size: 1024 })}) | [jpg](${member.user.displayAvatarURL({ format: 'jpg', size: 1024 })}) | [gif](${member.user.displayAvatarURL({ format: 'gif', size: 1024, dynamic: true })}) | [webp](${member.user.displayAvatarURL({ format: 'webp', size: 1024 })})`)
		.setImage(`${member.user.displayAvatarURL({ format: 'png', size: 256 })}`);
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
