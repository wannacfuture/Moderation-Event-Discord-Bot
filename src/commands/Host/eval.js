// Dependencies
const { inspect } = require('util');

module.exports.run = async (bot, message, args, emojis, settings, ops) => {
	// Makes sure only the bot owner can do this command
	if (message.member.id != bot.config.ownerID) return message.channel.send('**What do you think you\'re doing?**');
	const toEval = args.join(' ');
	// Evaluated the code
	try {
		if (toEval) {
			// Auto-complete commands
			const hrStart = process.hrtime();
			let evaluated;
			if (toEval == 'serverlist') {
				evaluated = `Total server count: ${bot.guilds.cache.size}\n\n${bot.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r).map((r, i) => `${i + 1}.) ${r.name} | ${r.memberCount}`).slice(0, 10).join('\n')}`;
			} else if (toEval == 'queue') {
				evaluated = (inspect(eval(ops.active, { depth: 0 })).length == 9) ? 'No music playing.' : inspect(eval(ops.active, { depth: 0 }));
			} else {
				evaluated = inspect(eval(toEval, { depth: 0 }));
			}
			const hrDiff = process.hrtime(hrStart);
			return await message.channel.send(`*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms.*\`\`\`javascript\n${evaluated}\n\`\`\``, { maxLength: 1900 });
		} else {
			message.channel.send({ embed:{ color:15158332, description:`${emojis[0]} Please use the format \`${bot.commands.get('eval').help.usage.replace('${PREFIX}', settings.prefix)}\`.` } }).then(m => m.delete({ timeout: 3000 }));
		}
	} catch(err) {
		if (bot.config.debug) bot.logger.error(`${err.message} - command: eval.`);
		message.channel.send(`Error whilst evaluating: \`${err.message}\``);
	}
};

module.exports.config = {
	command: 'eval',
};

module.exports.help = {
	name: 'eval',
	category: 'Host',
	description: 'Evaluates code.',
	usage: '${PREFIX}eval <code>',
};
