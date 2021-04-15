// Dependencies
const { MessageEmbed } = require('discord.js'),
	Command = require('../../structures/Command.js');

// Lis of events
const features = ['CHANNELCREATE', 'CHANNELDELETE', 'CHANNELUPDATE', 'EMOJICREATE', 'EMOJIDELETE', 'EMOJIUPDATE', 'GUILDBANADD', 'GUILDBANREMOVE', 'GUILDMEMBERADD', 'GUILDMEMBERREMOVE', 'GUILDMEMBERUPDATE', 'GUILDUPDATE', 'MESSAGEDELETE', 'MESSAGEDELETEBULK', 'MESSAGEREACTIONADD', 'MESSAGEREACTIONREMOVE', 'MESSAGEUPDATE', 'ROLECREATE', 'ROLEDELETE', 'ROLEUPDATE', 'VOICESTATEUPDATE'];

module.exports = class SetLog extends Command {
	constructor(bot) {
		super(bot, {
			name: 'set-logs',
			dirname: __dirname,
			aliases: ['setlogs'],
			userPermissions: ['MANAGE_GUILD'],
			botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Update the log plugin.',
			usage: 'set-logs <add | removed> [log]',
			cooldown: 5000,
			examples: ['set-logs channel 761612724370931722', 'set-logs add CHANNELCREATE'],
		});
	}

	// Run command
	async run(bot, message, settings) {
		// Delete message
		if (settings.ModerationClearToggle & message.deletable) message.delete();

		// Make sure user can edit server plugins
		if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.error(settings.Language, 'USER_PERMISSION', 'MANAGE_GUILD').then(m => m.delete({ timeout: 10000 }));

		if (!message.args[0]) {
			const embed = new MessageEmbed()
				.setTitle('Logging plugin')
				.setColor(message.member.displayHexColor)
				.setDescription(`\`${settings.prefix}set-logs <true | false>\`\n\`${settings.prefix}set-logs channel <ChannelID>\`\n\`${settings.prefix}set-logs <add | remove> LOG\``);
			message.channel.send(embed);
		} else if (message.args[0] == 'true' || message.args[0] == 'false') {

			// Enabled/Disable ModLogs
			try {
				await message.guild.updateGuild({ ModLog: message.args[0] });
				settings.ModLog = message.args[0];
				message.channel.success(settings.Language, 'PLUGINS/LOGS_SET', message.args[0]).then(m => m.delete({ timeout:10000 }));
			} catch (err) {
				bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
				message.channel.error(settings.Language, 'ERROR_MESSAGE', err.message).then(m => m.delete({ timeout: 5000 }));
			}
		} else if (message.args[0] == 'add' || message.args[0] == 'remove') {
			const currentFeatures = settings.ModLogEvents;
			if (!message.args[1] || !features.includes(message.args[1].toUpperCase())) {
				// show logs
				const embed = new MessageEmbed()
					.setTitle('Logging features:')
					.setColor(message.member.displayHexColor)
					.setDescription(`Available features: \`${features.join('`, `')}\`.\n\nCurrent features: \`${currentFeatures.join('`, `')}\`.`);
				message.channel.send(embed).then(m => m.delete({ timeout: 15000 }));
			} else if (message.args[0] == 'add') {

				// add new Logging
				try {
					currentFeatures.push(message.args[1].toUpperCase());
					await message.guild.updateGuild({ ModLogEvents: currentFeatures });
					settings.ModLogEvents = currentFeatures;
					message.channel.send(`Added: ${message.args[1].toUpperCase()} to logging.`);
				} catch (err) {
					bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
					message.channel.error(settings.Language, 'ERROR_MESSAGE', err.message).then(m => m.delete({ timeout: 5000 }));
				}
			} else if (message.args[0] == 'remove') {

				// remove features
				try {
					if (currentFeatures.indexOf(message.args[1].toUpperCase()) > -1) {
						currentFeatures.splice(currentFeatures.indexOf(message.args[1].toUpperCase()), 1);
					}
					await message.guild.updateGuild({ ModLogEvents: currentFeatures });
					settings.ModLogEvents = currentFeatures;
					message.channel.send(`Removed: ${message.args[1].toUpperCase()} from logging.`);
				} catch (err) {
					bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
					message.channel.error(settings.Language, 'ERROR_MESSAGE', err.message).then(m => m.delete({ timeout: 5000 }));
				}
			} else {
				const embed = new MessageEmbed()
					.setTitle('Logging plugin')
					.setColor(message.member.displayHexColor)
					.setDescription(`\`${settings.prefix}set-logs <true | false>\`\n\`${settings.prefix}set-logs channel <ChannelID>\`\n\`${settings.prefix}set-logs <add | remove> LOG\``);
				message.channel.send(embed);
			}
		} else if (message.args[0] == 'channel') {
			try {
				const channelID = (message.guild.channels.cache.find(channel => channel.id == message.args[1])) ? message.guild.channels.cache.find(channel => channel.id == message.args[1]).id : message.channel.id;
				if (channelID) {
					await message.guild.updateGuild({ ModLogChannel: channelID });
					settings.ModLogChannel = channelID;
					message.channel.success(settings.Language, 'PLUGINS/LOG_CHANNEL', channelID);
				}
			} catch (err) {
				bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
				message.channel.error(settings.Language, 'ERROR_MESSAGE', err.message).then(m => m.delete({ timeout: 5000 }));
			}
		} else {
			return message.channel.error(settings.Language, 'INCORRECT_FORMAT', settings.prefix.concat(this.help.usage)).then(m => m.delete({ timeout: 5000 }));
		}
	}
};
