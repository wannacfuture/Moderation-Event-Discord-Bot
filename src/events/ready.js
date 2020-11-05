const { Guild } = require('../modules/database/models');

module.exports = async bot => {
	// LOG ready event
	bot.logger.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=', 'ready');
	bot.logger.log(`${bot.user.tag}, ready to serve [${bot.users.cache.size}] users in [${bot.guilds.cache.size}] servers.`, 'ready');
	bot.logger.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=', 'ready');

	bot.appInfo = await bot.fetchApplication();
	// dashboard comes online (moved here so user information can be retrieved from bot to dashboard)
	require('../modules/website/dashboard')(bot);
	setInterval(async () => {
		bot.appInfo = await bot.fetchApplication();
	}, 60000);
	// Sets Bot's activity to !help and status to 'Online'
	const activities = [`${bot.guilds.cache.size} servers!`, `${bot.users.cache.size} users!`];
	let j = 0;
	setInterval(() => bot.user.setActivity(`${activities[j++ % activities.length]}`, { type: 'WATCHING' }), 10000);
	bot.user.setStatus('Online');
	// Check if any servers added the bot while offline
	bot.guilds.cache.forEach(async item => {
		let settings;
		try {
			settings = await bot.getGuild(item);
		} catch (e) {
			console.log(e);
		}
		if (settings.guildID == undefined) {
			// new guild has been found
			eval('bot.emit(\'guildCreate\', item)', { depth: 0 });
		}
	});
	// Delete server settings on servers that removed the bot while it was offline
	const data = await Guild.find({});
	if (data.length > bot.guilds.cache.size) {
		// A server kicked the bot when it was offline
		const guildCount = [];
		// Get bot guild ID's
		for (let i = 0; i < bot.guilds.cache.size; i++) {
			guildCount.push(bot.guilds.cache.array()[i].id);
		}
		// Now check database for bot guild ID's
		for (let i = 0; i < data.length; i++) {
			if (!guildCount.includes(data[i].guildID)) {
				const guild = {
					id: `${data[i].guildID}`,
					name: `${data[i].guildName}`,
				};
				eval('bot.emit(\'guildDelete\', guild)', { depth:0 });
			}
		}
	}
};
