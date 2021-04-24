// Dependencies
const { MessageEmbed } = require('discord.js'),
	Event = require('../structures/Event');

module.exports = class guildMemberUpdate extends Event {
	async run(bot, oldMember, newMember) {
		// For debugging
		if (bot.config.debug) bot.logger.debug(`Member: ${newMember.user.tag} has been updated in guild: ${newMember.guild.id}.`);

		// Check if guildMember is a partial
		if (oldMember.partial) await oldMember.fetch();
		if (newMember.partial) await newMember.fetch();

		// get server settings
		const settings = newMember.guild.settings;
		if (Object.keys(settings).length == 0) return;

		// Check if event guildMemberUpdate is for logging
		if (settings.ModLogEvents.includes('GUILDMEMBERUPDATE') && settings.ModLog) {

			// nickname change
			if (oldMember.nickname != newMember.nickname) {
				const embed = new MessageEmbed()
					.setDescription(`**${newMember.toString()} nickname changed**`)
					.setFooter(`ID: ${newMember.id}`)
					.setAuthor(newMember.user.tag, newMember.user.displayAvatarURL())
					.addFields(
						{ name: 'Before:', value: `${oldMember.nickname ? oldMember.nickname : '*None*'}`, inline: true },
						{ name: 'After:', value: `${newMember.nickname ? newMember.nickname : '*None*'}`, inline: true })
					.setTimestamp();

				// Find channel and send message
				const modChannel = await bot.channels.fetch(settings.ModLogChannel);
				if (modChannel && modChannel.guild.id == newMember.guild.id) bot.addEmbed(modChannel.id, embed);
			}

			// Look to see if user has boosted the server
			if (!oldMember.premiumSince && newMember.premiumSince) {
				const embed = new MessageEmbed()
					.seDescripition(`**${newMember.toString()} has boosted the server**`)
					.setFooter(`ID: ${newMember.id}`)
					.setAuthor(newMember.user.tag, newMember.user.displayAvatarURL())
					.setTimestamp();

				// Find channel and send message
				const modChannel = await bot.channels.fetch(settings.ModLogChannel);
				if (modChannel && modChannel.guild.id == newMember.guild.id) bot.addEmbed(modChannel.id, embed);
			}

			// Look to see if user has stopped boosted the server
			if (oldMember.premiumSince && !newMember.premiumSince) {
				const embed = new MessageEmbed()
					.seDescripition(`**${newMember.toString()} has unboosted the server**`)
					.setFooter(`ID: ${newMember.id}`)
					.setAuthor(newMember.user.tag, newMember.user.displayAvatarURL())
					.setTimestamp();

				// Find channel and send message
				const modChannel = await bot.channels.fetch(settings.ModLogChannel);
				if (modChannel && modChannel.guild.id == newMember.guild.id) bot.addEmbed(modChannel.id, embed);
			}

			// Look to see if user has changed their surname
			if (oldMember.username !== newMember.username) {
				const embed = new MessageEmbed()
					.setDescription(`**username changed of ${newMember.toString()}**`)
					.setColor(15105570)
					.setFooter(`ID: ${newMember.id}`)
					.setAuthor(newMember.guild.name, newMember.guild.iconURL())
					.addFields(
						{ name: 'Old:', value: `${oldMember.name}`, inline: true },
						{ name: 'New:', value: `${newMember.name}`, inline: true },
					)
					.setTimestamp();

				// Find channel and send message
				const modChannel = await bot.channels.fetch(settings.ModLogChannel);
				if (modChannel && modChannel.guild.id == newMember.guild.id) bot.addEmbed(modChannel.id, embed);
			}

			// look for role change
			const rolesAdded = newMember.roles.cache.filter(x => !oldMember.roles.cache.get(x.id));
			const rolesRemoved = oldMember.roles.cache.filter(x => !newMember.roles.cache.get(x.id));
			if (rolesAdded.size != 0 || rolesRemoved.size != 0) {
				let roleAddedString = '';
				for (const role of rolesAdded.array()) {
					roleAddedString += role.toString();
				}
				let roleRemovedString = '';
				for (const role of rolesRemoved.array()) {
					roleRemovedString += role.toString();
				}
				const embed = new MessageEmbed()
					.setDescription(`**${newMember.toString()} roles changed**`)
					.setFooter(`ID: ${newMember.id}`)
					.setAuthor(newMember.user.tag, newMember.user.displayAvatarURL())
					.addFields(
						{ name: `Added role [${rolesAdded.size}]:`, value: `${roleAddedString.length == 0 ? '*None*' : roleAddedString}`, inline: true },
						{ name: `Removed Roles [${rolesRemoved.size}]:`, value: `${roleRemovedString.length == 0 ? '*None*' : roleRemovedString}`, inline: true })
					.setTimestamp();

				// Find channel and send message
				const modChannel = await bot.channels.fetch(settings.ModLogChannel);
				if (modChannel && modChannel.guild.id == newMember.guild.id) bot.addEmbed(modChannel.id, embed);
			}
		}
	}
};
