const { Warning } = require('../../modules/database/models');
const Discord = require('discord.js');

module.exports.run = (bot, message, emojis, wUser, wReason, settings) => {
	// retrieve user data in warning database
	Warning.findOne({
		userID: wUser.user.id,
		guildID: message.guild.id,
	}, async (err, res) => {
		if (err) bot.logger.error(err.message);
		// This is their first warning
		if (!res) {
			try {
				const newWarn = new Warning({
					userID: wUser.user.id,
					guildID: message.guild.id,
					Warnings: 1,
					Reason: [`${wReason}`],
					Moderater: [`${(message.author.id == wUser.user.id) ? bot.user.id : message.author.id}`],
					IssueDates: [`${new Date().toUTCString()}`],
				});
				await newWarn.save().catch(e => bot.logger.error(e.message));
				const embed = new Discord.MessageEmbed()
					.setColor(15158332)
					.setAuthor(`${wUser.user.username}#${wUser.user.discriminator} has been warned`, wUser.user.displayAvatarURL())
					.setDescription(`**Reason:** ${wReason}`);
				message.channel.send(embed).then(m => m.delete({ timeout: 30000 }));
			} catch (err) {
				bot.logger.error(`${err.message} when running command: warnings.`);
				message.channel.send({ embed:{ color:15158332, description:`${emojis[0]} An error occured when running this command, please try again or contact support.` } }).then(m => m.delete({ timeout: 10000 }));
			}
		} else {
			// This is NOT their warning
			res.Warnings++;
			res.Reason.push(wReason);
			res.IssueDates.push(new Date().toUTCString());
			res.Moderater.push(message.author.id);
			if (res.Warnings == 2) {
				// Mutes user
				let muteTime;
				const muteRole = message.guild.roles.cache.find(role => role.id == settings.MutedRole);
				if (muteRole) {
					// 5 minutes
					muteTime = 300000;
					await (wUser.roles.add(muteRole));
				}
				const embed = new Discord.MessageEmbed()
					.setColor(15158332)
					.setAuthor(`${wUser.user.username}#${wUser.user.discriminator} has been warned`, wUser.user.displayAvatarURL())
					.setDescription(`**Reason:** ${wReason}`);
				message.channel.send(embed).then(m => m.delete({ timeout: 30000 }));
				// update database
				res.save().catch(e => console.log(e));
				// remove role after time
				if (muteRole) {
					setTimeout(() => {
						wUser.roles.remove(muteRole).catch(e => console.log(e));
					}, muteTime);
				}
			} else {
				try {
					await message.guild.member(wUser).kick(wReason);
					message.channel.send({ embed:{ color:3066993, description:`${bot.config.emojis.tick} *${wUser.username} was successfully kicked for having too many warnings*.` } }).then(m => m.delete({ timeout: 3500 }));
					// Delete user from database
					Warning.collection.deleteOne({ userID: wUser.user.id, guildID: message.guild.id });
				} catch (e) {
					bot.logger.error(`${err.message} when kicking user.`);
					message.channel.send({ embed:{ color:15158332, description:`${emojis[0]} I am unable to kick this user due to their power.` } }).then(m => m.delete({ timeout: 10000 }));
				}
			}
		}
		if (settings.ModLog == true) {
			const embed = new Discord.MessageEmbed()
				.setColor(15158332);
			if (res) {
				if (res.Warnings == 3) embed.setAuthor(`[KICK] ${wUser.user.username}#${wUser.user.discriminator}`, wUser.user.displayAvatarURL());
			} else {
				embed.setAuthor(`[WARN] ${wUser.user.username}#${wUser.user.discriminator}`, wUser.user.displayAvatarURL());
			}
			embed.addField('User:', `${wUser}`, true);
			embed.addField('Moderator:', `<@${message.author.id}>`, true);
			if (res) {
				if (res.Warnings != 3) {
					embed.addField('Warnings:', `${res.Warnings}`, true);
				}
			} else {
				bot.logger.log(`${wUser.user.tag} was warned from server: [${message.channel.guild.id}].`);
				embed.addField('Warnings:', '1', true);
			}
			embed.addField('Reason:', wReason);
			embed.setTimestamp();
			const modChannel = message.guild.channels.cache.find(channel => channel.id == settings.ModLogChannel);
			if (modChannel) modChannel.send(embed);
		}
	});
};
