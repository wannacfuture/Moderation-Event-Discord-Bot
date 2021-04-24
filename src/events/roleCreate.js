// Dependencies
const { MessageEmbed } = require('discord.js'),
	Event = require('../structures/Event');

module.exports = class roleCreate extends Event {
	async run(bot, role) {
		// For debugging
		if (bot.config.debug) bot.logger.debug(`Role: ${role.name} has been created in guild: ${role.guild.id}.`);

		// Get server settings / if no settings then return
		const settings = role.guild.settings;
		if (Object.keys(settings).length == 0) return;

		// Check if event roleCreate is for logging
		if (settings.ModLogEvents.includes('ROLECREATE') && settings.ModLog) {
			const embed = new MessageEmbed()
				.setDescription(`**Role: ${role} (${role.name}) was created**`)
				.setColor(3066993)
				.setFooter(`ID: ${role.id}`)
				.setAuthor(role.guild.name, role.guild.iconURL())
				.setTimestamp();

			// Find channel and send message
			const modChannel = await bot.channels.fetch(settings.ModLogChannel);
			if (modChannel && modChannel.guild.id == role.guild.id) bot.addEmbed(modChannel.id, embed);
		}
	}
};
