// Dependencies
const { Embed } = require('../../utils'),
	Command = require('../../structures/Command.js');

module.exports = class Avatar extends Command {
	constructor(bot) {
		super(bot, {
			name: 'avatar',
			guildOnly: true,
			dirname: __dirname,
			aliases: ['av'],
			botPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Displays user\'s avatar.',
			usage: 'avatar [user]',
			cooldown: 2000,
			examples: ['avatar userID', 'avatar @mention', 'avatar username'],
			slash: true,
			options: [{
				name: 'user',
				description: 'The user you want to grab the avatar of.',
				type: 'USER',
				required: true,
			}],
		});
	}

	// Run command
	async run(bot, message) {
		// Get user
		const members = await message.getMember();

		// send embed
		const embed = new Embed(bot, message.guild)
			.setTitle('guild/avatar:AVATAR_TITLE', { USER: members[0].user.tag })
			.setDescription([
				`${message.translate('guild/avatar:AVATAR_DESCRIPTION')}`,
				`[png](${members[0].user.displayAvatarURL({ format: 'png', size: 1024 })}) | [jpg](${members[0].user.displayAvatarURL({ format: 'jpg', size: 1024 })}) | [gif](${members[0].user.displayAvatarURL({ format: 'gif', size: 1024, dynamic: true })}) | [webp](${members[0].user.displayAvatarURL({ format: 'webp', size: 1024 })})`,
			].join('\n'))
			.setImage(`${members[0].user.displayAvatarURL({ dynamic: true, size: 1024 })}`);
		message.channel.send(embed);
	}
	async callback(bot, interaction, guild, args) {
		const member = guild.members.cache.get(args.get('user').value);
		
		// send embed
		const embed = new Embed(bot, guild)
			.setTitle('guild/avatar:AVATAR_TITLE', { USER: member.user.tag })
			.setDescription([
				`${bot.translate('guild/avatar:AVATAR_DESCRIPTION')}`,
				`[png](${member.user.displayAvatarURL({ format: 'png', size: 1024 })}) | [jpg](${member.user.displayAvatarURL({ format: 'jpg', size: 1024 })}) | [gif](${member.user.displayAvatarURL({ format: 'gif', size: 1024, dynamic: true })}) | [webp](${member.user.displayAvatarURL({ format: 'webp', size: 1024 })})`,
			].join('\n'))
			.setImage(`${member.user.displayAvatarURL({ dynamic: true, size: 1024 })}`);
		
		return await bot.send(interaction, embed);
	}
};
