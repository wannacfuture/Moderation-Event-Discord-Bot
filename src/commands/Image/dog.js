// Dependencies
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports.run = async (bot, message, args, emojis) => {
	const res = await fetch('https://nekos.life/api/v2/img/woof').then(info => info.json()).catch(err => {
		bot.logger.error(`${err.message}`);
		message.channel.send({ embed:{ color:15158332, description:`${emojis[0]} An error occured when running this command, please try again or contact support.` } }).then(m => m.delete({ timeout: 5000 }));
		message.delete();
		return;
	});
	const embed = new MessageEmbed()
		.setImage(res.url);
	message.channel.send(embed);
};

module.exports.config = {
	command: 'dog',
	aliases: ['woof'],
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
};

module.exports.help = {
	name: 'Dog',
	category: 'Image',
	description: 'Have a nice picture of a dog.',
	usage: '${PREFIX}dog',
};
