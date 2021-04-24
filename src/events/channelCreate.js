// Dependencies
const { MessageEmbed } = require('discord.js'),
	Event = require('../structures/Event');

module.exports = class channelCreate extends Event {
	async run(bot, channel) {
		// For debugging
		if (bot.config.debug) bot.logger.debug(`Channel: ${channel.type == 'dm' ? channel.recipient.tag : channel.name} has been created${channel.type == 'dm' ? '' : ` in guild: ${channel.guild.id}`}. (${channel.type})`);

		// Make sure the channel isn't a DM
		if (channel.type == 'dm') return;

		// Get server settings / if no settings then return
		const settings = channel.guild.settings;
		if (Object.keys(settings).length == 0) return;

		// Check if event channelCreate is for logging
		if (settings.ModLogEvents.includes('CHANNELCREATE') && settings.ModLog) {
			const embed = new MessageEmbed()
				.setDescription(`**${channel.type.charAt(0).toUpperCase() + channel.type.slice(1)} Created: ${channel.toString()}**`)
				.setColor(3066993)
				.setFooter(`ID: ${channel.id}`)
				.setAuthor(bot.user.username, bot.user.displayAvatarURL())
				.setTimestamp();

			// Find channel and send message
			const modChannel = await bot.channels.fetch(settings.ModLogChannel);
			if (modChannel && modChannel.guild.id == channel.guild.id) bot.addEmbed(modChannel.id, embed);
		}
	}
};
