const mongoose = require('mongoose');

const guildScheme = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	guildID: String,
	guildName: String,
	prefix: { type: String, default: 'e!' },
	// Welcome Plugin
	welcomePlugin: { type: Boolean, default: false },
	// if anti-raid is true and welcome plugin is true both will get activated so this will make sure anti-riad runs first and once 'accepeted' welcome plugn will run
	welcomeRaidConnect: { type: Boolean, default: false },
	welcomeMessageToggle: { type: Boolean, default: false },
	welcomeMessageChannel: { type: String, default: '00' },
	welcomeMessageText: { type: String, default: 'Hello {user}, Welcome to **{server}**!' },
	welcomePrivateToggle: { type: Boolean, default: false },
	welcomePrivateText: { type: String, default: 'Have a great time here in **{server}**.' },
	welcomeRoleToggle: { type: Boolean, default: false },
	welcomeRoleGive: { type: Array, default: ['562297641879470082'] },
	welcomeGoodbyeToggle: { type: Boolean, default: false },
	welcomeGoodbyeText: { type: String, default: '**{user}** just left the server.' },
	// Level plugin
	LevelPlugin: { type: Boolean, default: false },
	// 0 = no announcement, 1 = reply, 2 = choosen channel
	LevelOption: { type: Number, default: 1 },
	LevelChannel: { type: String, default: '00' },
	LevelMessage: { type: String, default: 'GG {user}, you have leveled up to {level}!' },
	LevelIgnoreRoles: { type: Array, default: ['No-xp'] },
	LevelIgnoreChannel: { type: Array, default: ['No-xp'] },
	LevelMultiplier: { type: Number, default: 1 },
	LevelRoleRewards: { type: Array, default: ['gf'] },
	// Music plugin
	MusicPlugin: { type: Boolean, default: true },
	MusicDJ: { type: Boolean, default: false },
	MusicDJRole: { type: String, default: '00' },
	// Music trivia plugin
	MusicTriviaPlugin: { type: Boolean, default: true },
	MusicTriviaGenres: { type: Array, default: ['pop'] },
	// logging plugin
	ModLog: { type: Boolean, default: false },
	ModLogEvents: { type: Array, default: ['BAN', 'KICK', 'MUTE'] },
	ModLogChannel: { type: String, default: '00' },
	ModLogIgnoreBot: { type: Boolean, default: true },
	// CommandCooldown
	CommandChannelToggle: { type: Boolean, default: false },
	CommandChannels: { type: Array, default: [11111111] },
	CommandCooldown: { type: Boolean, default: false },
	CommandCooldownSec: { type: Number, default: 2 },
	// Moderation plugin
	ModerationPlugin: { type: Boolean, default: false },
	ModeratorRoles: { type: Array, default: ['owner'] },
	MutedRole: { type: String, default: '00' },
	// 0 = disabled, 1 = delete message, 2 = warn member, 3 = delete message and warn member
	// These Channels are ignored
	// These roles are ignored
	ModerationBadwords: { type: Number, default: 1 },
	ModerationBadwordChannel: { type: Array, default: ['Forbadwords'] },
	ModerationBadwordRole: { type: Array, default: ['Forbadwords'] },
	ModerationBadwordList: { type: Array, default: ['IHateGingers'] },
	ModerationRepeatedText: { type: Number, default: 1 },
	ModerationRepeatedTextChannel: { type: Array, default: ['ForRepeatedText'] },
	ModerationRepeatedTextRole: { type: Array, default: ['ForRepeatedText'] },
	ModerationServerInvites: { type: Number, default: 1 },
	ModerationServerInvitesChannel: { type: Array, default: ['ForServerInvites'] },
	ModerationServerInvitesRole: { type: Array, default: ['ForServerInvites'] },
	ModerationExternalLinks: { type: Number, default: 1 },
	ModerationExternalLinksChannel: { type: Array, default: ['ForExternalLinks'] },
	ModerationExternalLinksRole: { type: Array, default: ['ForExternalLinks'] },
	ModerationExternalLinksAllowed: { type: Array, default: ['https://www.google.com', 'https://www.youtube.com'] },
	ModerationSpammedCaps: { type: Number, default: 1 },
	ModerationSpammedCapsChannel: { type: Array, default: ['ForSpam'] },
	ModerationSpammedCapsRole: { type: Array, default: ['ForSpam'] },
	ModerationSpammedCapsPercentage: { type: Number, default: 60 },
	ModerationExcessiveEmojis: { type: Number, default: 1 },
	ModerationExcessiveEmojisChannel: { type: Array, default: ['ForEmojis'] },
	ModerationExcessiveEmojisRole: { type: Array, default: ['ForEmojis'] },
	ModerationExcessiveEmojiPercentage: { type: Number, default: 60 },
	ModerationMassSpoilers: { type: Number, default: 1 },
	ModerationMassSpoilersChannel: { type: Array, default: ['Forspoilers'] },
	ModerationMassSpoilersRole: { type: Array, default: ['Forspoilers'] },
	ModerationMassSpoilersPercentage: { type: Number, default: 60 },
	ModerationMassMention: { type: Number, default: 1 },
	ModerationMassMentionChannel: { type: Array, default: ['ForMentions'] },
	ModerationMassMentionRole: { type: Array, default: ['ForMentions'] },
	ModerationMassMentionNumber: { type: Number, default: 5 },
	ModerationZalgo: { type: Number, default: 1 },
	ModerationZalgoChannel: { type: Array, default: ['ForZalgo'] },
	ModerationZalgoRole: { type: Array, default: ['ForZalgo'] },
	// How many warnings till the user is kicked from server
	ModerationWarningCounter: { type: Number, default: 3 },
	// If moderation commands should be deleted after.
	ModerationClearToggle: { type: Boolean, default: true },
	// If every bot's should be affected by auto-mod
	ModerationIgnoreBotToggle: { type: Boolean, default: true },
	// For ticket command
	TicketToggle: { type: Boolean, default: true },
	TicketSupportRole: { type: String, default: '00' },
	TicketCategory: { type: String, default: '00' },
	// for report command
	ReportToggle: { type: Boolean, default: true },
	// Anti-raid plugin
	AntiRaidPlugin: { type: Boolean, default: false },
	// 0 = nothing, 1 = verify account by reacting to message, 2 = must complete CAPTCHA to join
	AntiRaidCompletion: { type: Number, default: 1 },
	AntiRaidChannelID: { type: String, default: '00' },
	// Search PLugin
	SearchPlugin: { type: Boolean, default: true },
	NSFWPlugin: { type: Boolean, default: false },
	// Misc
	DisabledCommands: { type: Array, default: ['IWannaHackYou'] },
	// Server stats plugin
	ServerStats: { type: Boolean, default: false },
	ServerStatsCate: { type: String, default: '00' },
	// bot
	ServerStatsBot: { type: Boolean, default: false },
	ServerStatsBotChannel: { type: String, default: '00' },
	// user
	ServerStatsUser: { type: Boolean, default: false },
	ServerStatsUserChannel: { type: String, default: '00' },
	// human
	ServerStatsHuman: { type: Boolean, default: false },
	ServerStatsHumanChannel: { type: String, default: '00' },
});
module.exports = mongoose.model('Guild', guildScheme);
