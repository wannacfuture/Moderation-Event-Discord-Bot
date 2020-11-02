// Dependencies
const { MessageEmbed } = require('discord.js');
const { Warning } = require('../../modules/database/models/index');

module.exports.run = async (bot, message, args, emojis) => {
	// Get user
	const user = (bot.GetUser(message, args)) ? bot.GetUser(message, args) : message.guild.member(message.author);
	// get warnings of user
	try {
		await Warning.findOne({
			userID: user.id,
			guildID: message.guild.id,
		}, (err, warn) => {
			if(err) console.log(err);
			if (warn == null) {
				// There are no warnings with this user
				message.channel.send('This user has not been warned before.').then(m => m.delete({ timeout: 3500 }));
			} else {
				// Warnings have been found
				let list = `Warnings (${warn.Reason.length}):\n`;
				let i = 0;
				while (warn.Reason.length != i) {
					list += `${i + 1}.) ${warn.Reason[i]} | ${(message.guild.members.cache.get(warn.Moderater[i])) ? message.guild.members.cache.get(warn.Moderater[i]) : 'User left'} (Issue date: ${warn.IssueDates[i]})\n`;
					i++;
				}
				const embed = new MessageEmbed()
					.setTitle(`${user.user.username}'s warning list.`)
					.setDescription(list)
					.setTimestamp();
				message.channel.send(embed);
			}
		});
	} catch (err) {
		if (bot.config.debug) bot.logger.error(`${err.message} - command: warnings.`);
		message.channel.send({ embed:{ color:15158332, description:`${emojis[0]} An error occured when running this command, please try again or contact support.` } }).then(m => m.delete({ timeout: 10000 }));
	}
};

module.exports.config = {
	command: 'warnings',
	aliases: ['warns'],
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
};

module.exports.help = {
	name: 'Warnings',
	category: 'Moderation',
	description: 'Display number of warnings a user has.',
	usage: '${PREFIX}warnings [user]',
};
