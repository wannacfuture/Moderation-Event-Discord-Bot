// Dependencies
const { Embed } = require('../../utils'),
	Command = require('../../structures/Command.js');

module.exports = class Search extends Command {
	constructor(bot) {
		super(bot, {
			name: 'search',
			dirname: __dirname,
			botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT', 'SPEAK'],
			description: 'Searches for a song.',
			usage: 'search <link / song name>',
			cooldown: 3000,
			examples: ['search palaye royale'],
		});
	}

	// Function for message command
	async run(bot, message, settings) {
		// Check if the member has role to interact with music plugin
		if (message.guild.roles.cache.get(settings.MusicDJRole)) {
			if (!message.member.roles.cache.has(settings.MusicDJRole)) {
				return message.channel.error('misc:MISSING_ROLE').then(m => m.timedDelete({ timeout: 10000 }));
			}
		}

		// make sure user is in a voice channel
		if (!message.member.voice.channel) return message.channel.send(message.translate('music/search:NOT_VC'));

		// Check that user is in the same voice channel
		if (bot.manager.players.get(message.guild.id)) {
			if (message.member.voice.channel.id != bot.manager.players.get(message.guild.id).voiceChannel) return message.channel.error('misc:NOT_VOICE').then(m => m.timedDelete({ timeout: 10000 }));
		}

		// Check if VC is full and bot can't join doesn't have (MANAGE_CHANNELS)
		if (message.member.voice.channel.full && !message.member.voice.channel.permissionsFor(message.guild.me).has('MOVE_MEMBERS')) {
			return message.channel.error('music/play:VC_FULL').then(m => m.timedDelete({ timeout: 10000 }));
		}

		// Make sure that a song/url has been entered
		if (!message.args) return message.channel.error('music/search:NO_INPUT');

		// Create player
		let player;
		try {
			player = bot.manager.create({
				guild: message.guild.id,
				voiceChannel: message.member.voice.channel.id,
				textChannel: message.channel.id,
				selfDeafen: true,
			});
		} catch (err) {
			if (message.deletable) message.delete();
			bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			return message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }).then(m => m.timedDelete({ timeout: 5000 }));
		}

		const search = message.args.join(' ');
		let res;

		// Search for track
		try {
			res = await player.search(search, message.author);
			if (res.loadType === 'LOAD_FAILED') {
				if (!player.queue.current) player.destroy();
				throw res.exception;
			}
		} catch (err) {
			return message.channel.error('music/search:ERROR', { ERROR: err.message }).then(m => m.timedDelete({ timeout: 5000 }));
		}

		// Workout what to do with the results
		if (res.loadType == 'NO_MATCHES') {
			// An error occured or couldn't find the track
			if (!player.queue.current) player.destroy();
			return message.channel.error('music/search:NO_SONG');
		} else {
			// Display the options for search
			let max = 10, collected;
			const filter = (m) => m.author.id === message.author.id && /^(\d+|cancel)$/i.test(m.content);
			if (res.tracks.length < max) max = res.tracks.length;

			const results = res.tracks.slice(0, max).map((track, index) => `${++index} - \`${track.title}\``).join('\n');
			const embed = new Embed(bot, message.guild)
				.setTitle('music/search:TITLE', { TITLE: message.args.join(' ') })
				.setColor(message.member.displayHexColor)
				.setDescription(message.translate('music/search:DESC', { RESULTS: results }));
			message.channel.send({ embeds: [embed] });

			try {
				collected = await message.channel.awaitMessages(filter, { max: 1, time: 30e3, errors: ['time'] });
			} catch (e) {
				if (!player.queue.current) player.destroy();
				return message.reply(message.translate('misc:WAITED_TOO_LONG'));
			}

			const first = collected.first().content;
			if (first.toLowerCase() === 'cancel') {
				if (!player.queue.current) player.destroy();
				return message.channel.send(message.translate('misc:CANCELLED'));
			}

			const index = Number(first) - 1;
			if (index < 0 || index > max - 1) return message.reply(message.translate('music/search:INVALID', { NUM: max }));

			const track = res.tracks[index];
			if (player.state !== 'CONNECTED') player.connect();
			player.queue.add(track);

			if (!player.playing && !player.paused && !player.queue.size) {
				player.play();
			} else {
				message.channel.send(message.translate('music/search:ADDED', { TITLE: track.title }));
			}
		}
	}
};
