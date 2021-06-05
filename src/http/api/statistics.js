// Dependencies
const express = require('express'),
	router = express.Router();

let totalUsers
module.exports = (bot) => {
	// statistics page
	router.get('/', async function(req, res) {
		if (bot.config.debug) bot.logger.debug(`IP: ${req.connection.remoteAddress.slice(7)} accessed \`/statistics\`.`);

		bot.guilds.cache.forEach(guild => {
			totalUsers = totalUsers + ( guild.memberCount ?  guild.memberCount : 0)
    })

		res.status(200).json({
			guildCount: bot.guilds.cache.size,
			cachedUsers: bot.users.cache.size,
			totalMembers: totalUsers,
			uptime: process.uptime() * 1000,
			commandCount: bot.commands.size,
			memoryUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
			textChannels: bot.channels.cache.filter(channel => channel.type === 'text').size,
			voiceChannels: bot.channels.cache.filter(channel => channel.type === 'voice').size,
			MessagesSeen: bot.messagesSent,
			CommandsRan: bot.commandsUsed,
			ping: Math.round(bot.ws.ping),
		});
	});

	return router;
};
