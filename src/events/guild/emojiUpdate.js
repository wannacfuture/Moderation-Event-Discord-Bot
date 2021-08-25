// Dependencies
const { Embed } = require('../../utils'),
	Event = require('../../structures/Event');

/**
 * Emoji update event
 * @event Egglord#EmojiUpdate
 * @extends {Event}
*/
class EmojiUpdate extends Event {
	constructor(...args) {
		super(...args, {
			dirname: __dirname,
		});
	}

	/**
	 * Function for recieving event.
	 * @param {bot} bot The instantiating client
	 * @param {GuildEmoji} oldEmoji The emoji before the update
	 * @param {GuildEmoji} newEmoji The emoji after the update
	 * @readonly
	*/
	async run(bot, oldEmoji, newEmoji) {
		// For debugging
		if (bot.config.debug) bot.logger.debug(`Emoji: ${newEmoji.name} has been updated in guild: ${newEmoji.guild.id}.`);

		// Get server settings / if no settings then return
		const settings = newEmoji.guild.settings;
		if (Object.keys(settings).length == 0) return;

		// Check if event emojiUpdate is for logging
		if (settings.ModLogEvents?.includes('EMOJIUPDATE') && settings.ModLog) {
			let embed, updated = false;

			// emoji name change
			if (oldEmoji.name != newEmoji.name) {
				embed = new Embed(bot, newEmoji.guild)
					.setDescription('**Emoji name update**')
					.setColor(15105570)
					.setFooter(`ID: ${newEmoji.id}`)
					.setAuthor(newEmoji.guild.name, newEmoji.guild.iconURL())
					.addFields(
						{ name: 'Old:', value: `${oldEmoji.name}`, inline: true },
						{ name: 'New:', value: `${newEmoji.name}`, inline: true },
					)
					.setTimestamp();
				updated = true;
			}

			// emoji role update
			if (oldEmoji.roles.cache.size != newEmoji.roles.cache.size) {
				const rolesAdded = newEmoji.roles.cache.filter(x => !oldEmoji.roles.cache.get(x.id));
				const rolesRemoved = oldEmoji.roles.cache.filter(x => !newEmoji.roles.cache.get(x.id));
				if (rolesAdded.size != 0 || rolesRemoved.size != 0) {
					const roleAddedString = [];
					for (const role of [...rolesAdded.values()]) {
						roleAddedString.push(role.toString());
					}
					const roleRemovedString = [];
					for (const role of [...rolesRemoved.values()]) {
						roleRemovedString.push(role.toString());
					}
					embed = new Embed(bot, newEmoji.guild)
						.setDescription('**Emoji roles updated**')
						.setColor(15105570)
						.setFooter(`ID: ${newEmoji.id}`)
						.setAuthor(newEmoji.guild.name, newEmoji.guild.iconURL())
						.addFields(
							{ name: `Added roles [${rolesAdded.size}]:`, value: `${roleAddedString.length == 0 ? '*None*' : roleAddedString.join('\n ')}`, inline: true },
							{ name: `Removed roles [${rolesRemoved.size}]:`, value: `${roleRemovedString.length == 0 ? '*None*' : roleRemovedString.join('\n ')}`, inline: true })
						.setTimestamp();
					updated = true;
				}
			}

			if (updated) {
				// Find channel and send message
				try {
					const modChannel = await bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${newEmoji.guild.id} logging channel`));
					if (modChannel && modChannel.guild.id == newEmoji.guild.id) bot.addEmbed(modChannel.id, [embed]);
				} catch (err) {
					bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
				}
			}
		}
	}
}

module.exports = EmojiUpdate;
