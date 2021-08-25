// Dependencies
const { Embed } = require('../../utils'),
	Event = require('../../structures/Event');

/**
 * Invite delete event
 * @event Egglord#InviteDelete
 * @extends {Event}
*/
class InviteDelete extends Event {
	constructor(...args) {
		super(...args, {
			dirname: __dirname,
		});
	}

	/**
	 * Function for recieving event.
	 * @param {bot} bot The instantiating client
	 * @param {Invite} invite The invite that was deleted
	 * @readonly
	*/
	async run(bot, invite) {
		// Get server settings / if no settings then return
		const settings = invite.guild.settings;
		if (Object.keys(settings).length == 0) return;

		// Check if event guildMemberAdd is for logging
		if (settings.ModLogEvents?.includes('INVITEDELETE') && settings.ModLog) {
			const embed = new Embed(bot, invite.guild)
				.setDescription('**Invite Deleted**')
				.setColor(15158332)
				.setFooter(`Guild ID: ${invite.guild.id}`)
				.setTimestamp();

			// Find channel and send message
			try {
				const modChannel = await bot.channels.fetch(settings.ModLogChannel).catch(() => bot.logger.error(`Error fetching guild: ${invite.guild.id} logging channel`));
				if (modChannel && modChannel.guild.id == invite.guild.id) bot.addEmbed(modChannel.id, [embed]);
			} catch (err) {
				bot.logger.error(`Event: '${this.conf.name}' has error: ${err.message}.`);
			}
		}
	}
}

module.exports = InviteDelete;
