// Get prefix for bot
const Discord = require('discord.js');
// Map for music
const active = new Map();

// cooldown on commands (2.5 seconds)
const commandcd = new Set();

function duration(ms) {
	const sec = Math.floor((ms / 1000) % 60).toString();
	const min = Math.floor((ms / (1000 * 60)) % 60).toString();
	const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
	const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
	return `${days.padStart(1, '0')}:${hrs.padStart(2, '0')}:${min.padStart(2, '0')}:${sec.padStart(2, '0')}`;
}
// This gets message from discord server and checks for (command, moderation)
module.exports = async (bot, message) => {
	// Make sure the bot isnt speaking to its self
	if (message.author.bot == true) return;

	// Get server settings
	let settings;
	try {
		settings = await bot.getGuild(message.guild);
	} catch (e) {
		settings = bot.config.defaultSettings;
	}
	bot.Stats.MessageSent++;
	// If bot is mentioned show help (User probably dosen't know how to interact to me)
	if (message.mentions.has(bot.user) && message.content == `<@!${bot.config.botID}>`) {
		// make sure egglord has SEND_MESSAGES permission
		if (message.channel.type != 'dm') {
			if (!message.channel.permissionsFor(bot.user).has('SEND_MESSAGES')) return bot.logger.error(`Missing permission: \`SEND_MESSAGES\` in [${message.guild.id}]`);
		}
		// Send egglord information to user
		const embed = new Discord.MessageEmbed()
			.setTitle(`${bot.user.username}'s Information`)
			.setURL(bot.config.Dashboard.domain)
			.setThumbnail(bot.user.displayAvatarURL())
			.setDescription(`I help moderate [${bot.guilds.cache.size}] servers\n Your server prefix: ${settings.prefix}help\n Got a bug? Report it here ${settings.prefix}bug\n[Add to server](https://discordapp.com/api/oauth2/authorize?client_id=${bot.config.botID}&permissions=8&scope=bot)`)
			.addField('Server Count:', `${bot.guilds.cache.size} (${bot.users.cache.size} users)`)
			.addField('Uptime:', `${duration(bot.uptime)}`)
			.addField('Total Commands:', `${bot.commands.size} (!help)`)
			.addField('Ping:', `${Math.round(bot.ws.ping)}ms`)
			.setTimestamp()
			.setFooter(`Requested by @${message.author.username}`);
		message.channel.send(embed);
	}

	// Checks to see if a command was initated
	const args = message.content.split(' ');
	const command = args.shift().slice(settings.prefix.length).toLowerCase();
	const cmd = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command));
	const ops = {
		active: active,
	};
	// Check for commands (+ command cooldown -2.5 seconds)
	if (message.content == '@someone') {
		// pick a random user from the server
		message.channel.send(`Random user selcted: ${message.guild.members.cache.random().user}.`);
	} else if (cmd && message.content.startsWith(settings.prefix)) {
		// Check for SEND_MESSAGES permission
		// only run Fun, Host & Search plugin commands in DM's
		let emojis;
		if (message.channel.type == 'dm') {
			// Make sure command is not a server only command.
			if (['Guild', 'Level', 'Music', 'Trivia', 'Moderation'].includes(cmd.help.category)) {
				message.channel.send({ embed:{ color:15158332, description:`${bot.config.emojis.cross} That command can only be ran in a server.` } }).then(m => m.delete({ timeout: 5000 }));
				return;
			}
			emojis = [bot.config.emojis.cross, bot.config.emojis.tick];
		} else {
			emojis = [(message.channel.permissionsFor(bot.user).has('USE_EXTERNAL_EMOJIS')) ? bot.config.emojis.cross : ':negative_squared_cross_mark:', (message.channel.permissionsFor(bot.user).has('USE_EXTERNAL_EMOJIS')) ? bot.config.emojis.tick : ':white_check_mark:'];
			// Check for server permissions
			const permissions = message.channel.permissionsFor(bot.user);
			// Check for SEND_MESSAGES permission
			if (!permissions.has('SEND_MESSAGES')) {
				bot.logger.error(`Missing permission: \`SEND_MESSAGES\` in [${message.guild.id}]`);
				return;
			}
		}
		// Check if user is in command cooldown check
		if (commandcd.has(message.author.id) && (message.author.id != bot.config.ownerID)) {
			message.delete();
			message.channel.send({ embed:{ color:15158332, description:`${emojis[0]} You must wait ${settings.CommandCooldownSec} seconds between each command.` } }).then(m => m.delete({ timeout: 5000 }));
			return;
		}
		// Check to see if the command is being ran from a channel thats blacklisted
		if ((settings.OnlyCommandChannel == true) && (settings.CommandChannel !== message.channel.name)) {
			// Tell user that they cant use commnads in this channel
			message.channel.send({ embed:{ color:15158332, description:`${emojis[0]} **${message.author.username}#${message.author.discriminator}**, that command is disabled in this channel.` } }).then(m => m.delete({ timeout: 10000 }));
		} else if ((cmd.help.category == 'Nsfw' || cmd.config.command == 'urban' || cmd.config.command == 'advice') && !(message.channel.nsfw === true || message.channel.type == 'dm')) {
			// Check to make sure NSFW category is not being ran in NSFW channel
			message.delete();
			message.channel.send({ embed:{ color:15158332, description:`${emojis[0]} This command can only be done in a \`NSFW\` channel.` } }).then(m => m.delete({ timeout: 5000 }));
			return;
		} else if (cmd.help.category == 'Music' && settings.MusicPlugin == false) {
			// if music plugin is disabled
			return;
		} else if (cmd.help.category == 'moderation' && settings.ModerationPlugin == false) {
			// if moderation plugin is disabled
			return;
		} else {
			bot.Stats.CommandsUsed++;
			cmd.run(bot, message, args, emojis, settings, ops);
			// add user to command cooldown list
			if (settings.CommandCooldown == true) {
				commandcd.add(message.author.id);
				setTimeout(() => {
					commandcd.delete(message.author.id);
				}, settings.CommandCooldownSec * 1000);
			}
			return;
		}
	} else if (settings.ModerationPlugin == true) {
		const check = require('../modules/plugins/moderation').run(bot, message, settings);
		// This makes sure that if the auto-mod punished member, level plugin would not give XP
		if (settings.LevelPlugin == true && check) {
			require('../modules/plugins/Levels').run(bot, message, settings);
			return;
		}
		if (!check) return;
	} else if (settings.LevelPlugin == true) {
		require('../modules/plugins/Levels').run(bot, message, settings);
	}
};
