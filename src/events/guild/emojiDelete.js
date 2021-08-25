// Dependencies
const { Embed } = require('../../utils'),
	Event = require('../../structures/Event');

/**
 * Emoji delete event
 * @event Egglord#EmojiDelete
 * @extends {Event}
*/
class EmojiDelete extends Event {
	constructor(...args) {
		super(...args, {
			dirname: __dirname,
		});
	}

	/**
	 * Function for recieving event.
	 * @param {bot} bot The instantiating client
	 * @param {GuildEmoji} emoji The emoji that was deleted
	 * @readonly
	*/
	async run(bot, emoji) {
	// For debugging
		if (bot.config.debug) bot.logger.debug(`Emoji: ${emoji.name} has been deleted in guild: ${emoji.guild.id}.`);

		// Get server settings / if no settings then return
		const settings = emoji.guild.settings;
		if (Object.keys(settings).length == 0) return;

		// Check if event emojiDelete is for logging
		if (settings.ModLogEvents?.includes('EMOJIDELETE') && settings.ModLog) {
			const embed = new Embed(bot, emoji.guild)
				.setDescription(`**Emoji: ${emoji} (${emoji.name}) was deleted**`)
				.setColor(15158332)
				.setFooter(`ID: ${emoji.id}`)
				.setAuthor(emoji.guild.name, emoji.guild.iconURL())
				.setTimestamp();

			// Find channel and send message
			try {
				const modChannel = await bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${emoji.guild.id} logging channel`));
				if (modChannel && modChannel.guild.id == emoji.guild.id) bot.addEmbed(modChannel.id, [embed]);
			} catch (err) {
				bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
			}
		}
	}
}

module.exports = EmojiDelete;
