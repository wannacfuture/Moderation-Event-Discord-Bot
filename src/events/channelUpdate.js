// Dependencies
const { MessageEmbed } = require('discord.js'),
	Event = require('../structures/Event');

module.exports = class channelUpdate extends Event {
	async run(bot, oldChannel, newChannel) {
		// For debugging
		if (bot.config.debug) bot.logger.debug(`Channel: ${newChannel.type == 'dm' ? newChannel.recipient.tag : newChannel.name} has been updated${newChannel.type == 'dm' ? '' : ` in guild: ${newChannel.guild.id}`}. (${newChannel.type})`);


		// Get server settings / if no settings then return
		const settings = newChannel.guild.settings;
		if (Object.keys(settings).length == 0) return;

		// Check if event channelUpdate is for logging
		if (settings.ModLogEvents.includes('CHANNELUPDATE') && settings.ModLog) {

			// Channel name change
			if (oldChannel.name != newChannel.name) {
				const embed = new MessageEmbed()
					.setDescription(`**${newChannel.type === 'category' ? 'Category' : 'Channel'} name changed of ${newChannel.toString()}**`)
					.setColor(15105570)
					.setFooter(`ID: ${newChannel.id}`)
					.setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
					.addFields(
						{ name: 'Old:', value: `${oldChannel.name}`, inline: true },
						{ name: 'New:', value: `${newChannel.name}`, inline: true },
					)
					.setTimestamp();

				// Find channel and send message
				const modChannel = await bot.channels.fetch(settings.ModLogChannel);
				if (modChannel && modChannel.guild.id == newChannel.guild.id) bot.addEmbed(modChannel.id, embed);
			}

			// channel topic (description) change
			if (oldChannel.topic != newChannel.topic) {
				const embed = new MessageEmbed()
					.setDescription(`**${newChannel.type === 'category' ? 'Category' : 'Channel'} topic changed of ${newChannel.toString()}**`)
					.setColor(15105570)
					.setFooter(`ID: ${newChannel.id}`)
					.setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
					.addFields(
						{ name: 'Old:', value: `${oldChannel.topic ? oldChannel.topic : '*empty topic*'}`, inline: true },
						{ name: 'New:', value: `${newChannel.topic ? newChannel.topic : '*empty topic*'}`, inline: true },
					)
					.setTimestamp();

				// Find channel and send message
				const modChannel = await bot.channels.fetch(settings.ModLogChannel);
				if (modChannel && modChannel.guild.id == newChannel.guild.id) bot.addEmbed(modChannel.id, embed);
			}

			// Check for permission change
			const permDiff = oldChannel.permissionOverwrites.filter(x => {
				if (newChannel.permissionOverwrites.find(y => y.allow.bitfield == x.allow.bitfield) && newChannel.permissionOverwrites.find(y => y.deny.bitfield == x.deny.bitfield)) {
					return false;
				}
				return true;
			}).concat(newChannel.permissionOverwrites.filter(x => {
				if (oldChannel.permissionOverwrites.find(y => y.allow.bitfield == x.allow.bitfield) && oldChannel.permissionOverwrites.find(y => y.deny.bitfield == x.deny.bitfield)) {
					return false;
				}
				return true;
			}));

			if (permDiff.size) {
				const embed = new MessageEmbed()
					.setDescription(`**${newChannel.type === 'category' ? 'Category' : 'Channel'} permissions changed of ${newChannel.toString()}**\n*note:* check [docs](https://discordapp.com/developers/docs/topics/permissions) to see what the numbers mean`)
					.setColor(15105570)
					.setFooter(`ID: ${newChannel.id}`)
					.setAuthor(newChannel.guild.name, newChannel.guild.iconURL())
					.setTimestamp();
				for (const permID of permDiff.keys()) {
					// load both overwrites into variables
					const oldPerm = oldChannel.permissionOverwrites.get(permID) || {};
					const newPerm = newChannel.permissionOverwrites.get(permID) || {};
					const oldBitfields = {
						allowed: oldPerm.allow ? oldPerm.allow.bitfield : 0,
						denied: oldPerm.deny ? oldPerm.deny.bitfield : 0,
					};
					const newBitfields = {
						allowed: newPerm.allow ? newPerm.allow.bitfield : 0,
						denied: newPerm.deny ? newPerm.deny.bitfield : 0,
					};
					// load roles / guildmember for that overwrite
					let role;
					let member;
					if (oldPerm.type == 'role' || newPerm.type == 'role') {
						role = await newChannel.guild.roles.fetch(newPerm.id || oldPerm.id);
					}
					if (oldPerm.type == 'member' || newPerm.type == 'member') {
						member = await newChannel.guild.members.fetch(newPerm.id || oldPerm.id);
					}
					// make text about what changed
					let value = '';
					if (oldBitfields.allowed !== newBitfields.allowed) {
						value += `Allowed Perms: \`${oldBitfields.allowed}\` to \`${newBitfields.allowed}\`\n`;
					}
					if (oldBitfields.denied !== newBitfields.denied) {
						value += `Denied Perms: \`${oldBitfields.denied}\` to \`${newBitfields.denied}\``;
					}
					if (!value.length) value = 'Overwrite got deleted';
					// add field to embed
					embed.fields.push({
						'name': role ? role.name + ` (ID: ${role.id}):` : member.user.username + ` (ID: ${member.id}):`,
						'value': value,
					});
				}

				// Find channel and send message
				const modChannel = await bot.channels.fetch(settings.ModLogChannel);
				if (modChannel && modChannel.guild.id == newChannel.guild.id) bot.addEmbed(modChannel.id, embed);
			}
		}
	}
};
