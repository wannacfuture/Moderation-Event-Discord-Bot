// Dependencies
const Command = require('../../structures/Command.js');

module.exports = class Loop extends Command {
	constructor(bot) {
		super(bot, {
			name: 'loop',
			dirname: __dirname,
			aliases: ['repeat'],
			botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'SPEAK'],
			description: 'Loops the song or queue.',
			usage: 'loop [queue / song]',
			cooldown: 3000,
			examples: ['loop queue', 'loop'],
			slash: true,
			options: [{
				name: 'type',
				type: 'STRING',
				description: 'The entity you want to loop',
				required: false,
				choices: [
					{
						name: 'Queue',
						value: 'queue',
					},
					{
						name: 'Song',
						value: 'song',
					},
				],
			}],
		});
	}

	// Run command
	async run(bot, message, settings) {
		// Check if the member has role to interact with music plugin
		if (message.guild.roles.cache.get(settings.MusicDJRole)) {
			if (!message.member.roles.cache.has(settings.MusicDJRole)) {
				return message.channel.error('misc:MISSING_ROLE').then(m => m.timedDelete({ timeout: 10000 }));
			}
		}

		// Check that a song is being played
		const player = bot.manager.players.get(message.guild.id);
		if (!player) return message.channel.error('misc:NO_QUEUE').then(m => m.timedDelete({ timeout: 10000 }));

		// Check that user is in the same voice channel
		if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.error('misc:NOT_VOICE').then(m => m.timedDelete({ timeout: 10000 }));

		// Check what to loop (queue or song) - default to song
		if (!message.args[0] || message.args[0].toLowerCase() == 'song') {
			// (un)loop the song
			player.setTrackRepeat(!player.trackRepeat);
			const trackRepeat = message.translate(`misc:${player.trackRepeat ? 'ENABLED' : 'DISABLED'}`);
			return message.channel.send(message.translate('music/loop:TRACK', { TOGGLE: trackRepeat }));
		} else if (message.args[0].toLowerCase() == 'queue') {
			// (un)loop the queue
			player.setQueueRepeat(!player.queueRepeat);
			const queueRepeat = message.translate(`misc:${player.queueRepeat ? 'ENABLED' : 'DISABLED'}`);
			return message.channel.send(message.translate('music/loop:QUEUE', { TOGGLE: queueRepeat }));
		}
	}
	async callback(bot, interaction, guild, args) {
		// Check if the member has role to interact with music plugin
		const member = guild.members.cache.get(interaction.user.id);
		const channel = guild.channels.cache.get(interaction.channelID);
		const type = args.get('type').value;

		if (guild.roles.cache.get(guild.settings.MusicDJRole)) {
			if (!member.roles.cache.has(guild.settings.MusicDJRole)) {
				return interaction.reply({ ephemeral: true, embeds: [channel.error('misc:MISSING_ROLE', { ERROR: null }, true)] });
			}
		}

		// Check that a song is being played
		const player = bot.manager.players.get(guild.id);
		if(!player) return interaction.reply({ ephemeral: true, embeds: [channel.error('misc:NO_QUEUE', { ERROR: null }, true)] });

		// Check that user is in the same voice channel
		if (member.voice.channel.id !== player.voiceChannel) return interaction.reply({ ephemeral: true, embeds: [channel.error('misc:NOT_VOICE', { ERROR: null }, true)] });

		// Check what to loop (queue or song) - default to song
		if (!type || type == 'song') {
			// (un)loop the song
			player.setTrackRepeat(!player.trackRepeat);
			const trackRepeat = bot.translate(`misc:${player.trackRepeat ? 'ENABLED' : 'DISABLED'}`);
			return bot.send(interaction, bot.translate('music/loop:TRACK', { TOGGLE: trackRepeat }));
		} else if (type == 'queue') {
			// (un)loop the queue
			player.setQueueRepeat(!player.queueRepeat);
			const queueRepeat = bot.translate(`misc:${player.queueRepeat ? 'ENABLED' : 'DISABLED'}`);
			return bot.send(interaction, bot.translate('music/loop:QUEUE', { TOGGLE: queueRepeat }));
		}
	}
};
