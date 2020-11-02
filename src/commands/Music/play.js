// Dependencies
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const config = require('../../config.js');
const YouTubeAPI = require('simple-youtube-api');
const youtube = new YouTubeAPI(config.YoutubeAPI_Key);
const scdl = require('soundcloud-downloader');
const { getData } = require('spotify-url-info');

module.exports.run = async (bot, message, args, emojis, settings, ops) => {
	// check for bot permissions, song/playlist ( and if needed DJ role)
	if (!bot.musicHandler(message, args, emojis, settings)) {
		return;
	}
	// RegEx formulas
	const search = args.join(' ');
	const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
	const playlistPattern = /^.*(list=)([^#]*).*/gi;
	const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
	const url = args[0];
	const urlValid = videoPattern.test(args[0]);
	let song;

	// Check for playlist and play
	if (url) {
		if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
			// This checks for youtube playlist
			return message.client.commands.get('add-playlist').run(bot, message, args, emojis[0], settings, ops);
		} else if (scdl.isValidUrl(url) && url.includes('/sets/')) {
			// This checks for soundcloud playlist
			return message.client.commands.get('add-playlist').run(bot, message, args, emojis[0], settings, ops);
		} else if (args[0].includes('open.spotify.com/album') || args[0].includes('spotify:album:') || args[0].includes('open.spotify.com/playlist') || args[0].includes('spotify:playlist:')) {
			// this checks for spotify
			return message.client.commands.get('add-playlist').run(bot, message, args, emojis[0], settings, ops);
		} else if (scRegex.test(url)) {
			// play soundcloud
			try {
				const trackInfo = await scdl.getInfo(url, bot.config.soundcloudAPI_Key);
				song = {
					title: trackInfo.title,
					url: trackInfo.permalink_url,
					duration: Math.ceil(trackInfo.duration / 1000),
					thumbnail: trackInfo.artwork_url,
				};
			} catch (error) {
				if (error.statusCode === 404) {
					return message.reply('Could not find that Soundcloud track.').catch(console.error);
				}
				return message.reply('There was an error playing that Soundcloud track.').catch(console.error);
			}
		} else if (urlValid) {
			// Get youtube info directly from link
			try {
				const songInfo = await ytdl.getInfo(url);
				song = {
					title: songInfo.videoDetails.title,
					url: songInfo.videoDetails.video_url,
					duration: songInfo.videoDetails.lengthSeconds,
					thumbnail: songInfo.videoDetails.thumbnail.thumbnails[songInfo.videoDetails.thumbnail.thumbnails.length - 1].url,
				};
			} catch (e) {
				console.log(e);
				return message.channel.send({ embed:{ color:15158332, description:`${emojis[0]} Unable to find video with that song.` } }).then(m => m.delete({ timeout: 5000 }));
			}
		} else if (args[0].includes('open.spotify.com/track') || args[0].includes('spotify:track:')) {
			const spotifyData = await getData(url);
			console.log(spotifyData);
			try {
				const results = await youtube.searchVideos(`${spotifyData.name} - ${spotifyData.artists[0].name}`, 1);
				const songInfo = await ytdl.getInfo(results[0].url);
				song = {
					title: songInfo.videoDetails.title,
					url: songInfo.videoDetails.video_url,
					duration: songInfo.videoDetails.lengthSeconds,
					thumbnail: songInfo.videoDetails.thumbnail.thumbnails[songInfo.videoDetails.thumbnail.thumbnails.length - 1].url,
				};
			} catch(error) {
				bot.logger.error(`${error.message ? error.message : error}`);
				message.channel.send(`Error: ${error.message ? error.message : error}`);
			}
		} else {
			// search for song
			try {
				const results = await youtube.searchVideos(search, 1);
				const songInfo = await ytdl.getInfo(results[0].url);
				song = {
					title: songInfo.videoDetails.title,
					url: songInfo.videoDetails.video_url,
					duration: songInfo.videoDetails.lengthSeconds,
					thumbnail: songInfo.videoDetails.thumbnail.thumbnails[songInfo.videoDetails.thumbnail.thumbnails.length - 1].url,
				};
			} catch (e) {
				console.log(e);
				return message.channel.send({ embed:{ color:15158332, description:`${emojis[0]} Unable to find video with that song.` } }).then(m => m.delete({ timeout: 5000 }));
			}
		}
	}	else {
		console.log(message.attachments);
		return;
	}
	// get server information & join channel
	const data = ops.active.get(message.guild.id) || {};
	if (!data.connection) data.connection = await message.member.voice.channel.join();
	// deafen self (recieve less information from discord)
	data.connection.voice.setSelfDeaf(true);
	data.guildID = message.guild.id;
	if (!data.queue) data.queue = [];
	if (!data.volume) data.volume = 100;
	if (!data.loopQueue) data.loopQueue = false;
	if (!data.loopSong) data.loopSong = false;
	if (!data.filter) data.filter = null;
	if (!data.seek) data.seek = 0;
	// add songs to queue
	data.queue.push({
		title: song.title,
		requester: message.author.id,
		url: song.url,
		duration: song.duration,
		thumbnail: song.thumbnail,
	});
	ops.active.set(message.guild.id, data);
	if (!data.dispatcher) {
		require('../../utils/AudioPlayer.js').run(bot, ops, data, message);
	} else {
		// show that songs where added to queue
		const embed = new MessageEmbed()
			.setTitle('Added to queue')
			.setDescription(`[${song.title}](${song.url})`)
			.addField('Song duration:', `${require('../../utils/time.js').toHHMMSS(song.duration)}`, true)
			.addField('Posititon in Queue:', `${data.queue.length}`, true);
		message.channel.send(embed);
	}
};
module.exports.config = {
	command: 'play',
	aliases: ['p'],
	permissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'SPEAK'],
};
module.exports.help = {
	name: 'play',
	category: 'Music',
	description: 'Play a song.',
	usage: '${PREFIX}play <link | song name>',
};
