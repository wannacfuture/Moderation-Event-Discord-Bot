// Dependencies
const { Embed } = require('../../utils'),
	Command = require('../../structures/Command.js');

module.exports = class Firstmessage extends Command {
	constructor(bot) {
		super(bot, {
			name: 'firstmessage',
			guildOnly: true,
			dirname: __dirname,
			aliases: ['firstmsg', 'first-msg'],
			botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Gets the first message from the channel.',
			usage: 'firstmessage [channel]',
			cooldown: 2000,
			slash: true,
			options: [{
				name: 'channel',
				description: 'The specified channel to grab the first message of.',
				type: 'CHANNEL',
				required: true,
			}],
		});
	}

	// Function for message command
	async run(bot, message) {
		// get channel
		const channel = message.getChannel();

		try {
			// get first message in channel
			const fMessage = await channel[0].messages.fetch({ after: 1, limit: 1 }).then(msg => msg.first());
			const embed = this.createEmbed(bot, message.guild, fMessage);

			// send embed
			message.channel.send({ embeds: [embed] });
		} catch (err) {
			if (message.deletable) message.delete();
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }).then(m => m.timedDelete({ timeout: 5000 }));
		}
	}

	// Function for slash command
	async callback(bot, interaction, guild, args) {
		const channel = guild.channels.cache.get(args.get('channel').value);

		try {
			// get first message in channel
			const fMessage = await channel.messages.fetch({ after: 1, limit: 1 }).then(msg => msg.first());
			const embed = this.createEmbed(bot, guild, fMessage);

			// send embed
			bot.send(interaction, [embed]);
		} catch (err) {
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			return interaction.reply({ ephemeral: true, embeds: [channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }, true)] });
		}
	}

	// Create the embed for the first message in channel
	createEmbed(bot, guild, fMessage) {
		const embed = new Embed(bot, guild)
			.setColor(fMessage.member ? fMessage.member.displayHexColor : 0x00AE86)
			.setThumbnail(fMessage.author.displayAvatarURL({ format: 'png', dynamic: true }))
			.setAuthor(fMessage.author.tag, fMessage.author.displayAvatarURL({ format: 'png', dynamic: true }))
			.setDescription(fMessage.content)
			.addField(bot.translate('guild/firstmessage:JUMP'), fMessage.url)
			.setFooter('misc:ID', { ID: fMessage.id })
			.setTimestamp(fMessage.createdAt);
		return embed;
	}
};
