// Dependencies
const { MessageEmbed } = require('discord.js');
const createBar = require('string-progressbar');

module.exports.run = async (bot, message, args, emojis, settings, ops) => {
	const fetched = ops.active.get(message.guild.id);
	if (fetched == undefined) return message.channel.send({ embed:{ color:15158332, description:`${emojis[0]} There are currently no songs playing in this server.` } }).then(m => m.delete({ timeout: 5000 }));
	const song = fetched.queue[0];
	const seek = (fetched.connection.dispatcher.streamTime - fetched.connection.dispatcher.pausedTime) / 1000;

	// send message
	const embed = new MessageEmbed()
		.setAuthor('Now playing')
		.setDescription(`[${song.title}](${song.url}) [${message.guild.members.cache.find(member => member.id == song.requester)}]`)
		.setThumbnail(song.thumbnail)
		.setColor(3066993)
		.addField('\u200b', new Date(seek * 1000).toISOString().substr(11, 8) + ' [' + createBar(song.duration == 0 ? seek : song.duration, seek, 15)[0] + '] ' + (song.duration == 0 ? ' ◉ LIVE' : new Date(song.duration * 1000).toISOString().substr(11, 8)), false);
	message.channel.send(embed);
};
module.exports.config = {
	command: 'song',
	aliases: ['np', 'nowplaying'],
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'SPEAK'],
};
module.exports.help = {
	name: 'song',
	category: 'Music',
	description: 'Displays the current song playing.',
	usage: '${PREFIX}song',
};
