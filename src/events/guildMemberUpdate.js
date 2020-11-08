// Dependencies
const { MessageEmbed } = require('discord.js');

// send messages to log channel
function sendMessage(newMember, settings, embed, bot) {
	const channel = newMember.guild.channels.cache.find(c => c.id == settings.ModLogChannel);
	if (channel) channel.send(embed);
	// log event in console
	bot.logger.log(`Guild member: ${newMember.user.username} has been updated in Server: [${newMember.guild.id}].`);
}

module.exports = async (bot, oldMember, newMember) => {
	// Get server settings
	let settings;
	try {
		settings = await bot.getGuild(newMember.guild);
	} catch (e) {
		console.log(e);
	}
	// Check if ModLog plugin is active
	if (settings.ModLog == false) return;
	// Check if event channelCreate is for logging
	if (settings.ModLogEvents.includes('GUILDMEMBERUPDATE')) {
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
			// Send message
			sendMessage(newMember, settings, embed, bot);
		}
		// Look to see if user has boosted the server
		if (!oldMember.premiumSince && newMember.premiumSince) {
			const embed = MessageEmbed()
				.seDescripition(`**${newMember.toString()} has boosted the server**`)
				.setFooter(`ID: ${newMember.id}`)
				.setAuthor(newMember.user.tag, newMember.user.displayAvatarURL())
				.setTimestamp();
			sendMessage(newMember, settings, embed, bot);
		}
		// Look to see if user has stopped boosted the server
		if (oldMember.premiumSince && !newMember.premiumSince) {
			const embed = MessageEmbed()
				.seDescripition(`**${newMember.toString()} has unboosted the server**`)
				.setFooter(`ID: ${newMember.id}`)
				.setAuthor(newMember.user.tag, newMember.user.displayAvatarURL())
				.setTimestamp();
			sendMessage(newMember, settings, embed, bot);
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
			// send message
			sendMessage(newMember, settings, embed, bot);
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
			// Send message
			sendMessage(newMember, settings, embed, bot);
		}
	}
};
