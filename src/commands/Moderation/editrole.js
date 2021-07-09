// Dependencies
const Command = require('../../structures/Command.js'),
	fs = require("fs");
module.exports = class addrole extends Command {
	constructor(bot) {
		super(bot, {
			name: 'editrole',
			guildOnly: true,
			dirname: __dirname,
			aliases: ['modifyrole'],
			userPermissions: ['MANAGE_ROLES'],
			botPermissions: [ 'SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
			description: 'Remove warnings from a user.',
			usage: 'editrole <role name> <modifier> <value>',
			cooldown: 5000,
			examples: ['addrole Test colour yellow'],
		});
	}

	// Function for message command
	async run(bot, message, settings) {
        // Delete message
		if (settings.ModerationClearToggle && message.deletable) message.delete();

        if(!message.args[0]) return message.channel.error('misc:ERROR_MESSAGE', { ERROR: "Please provide the name of the role" }).then(m => m.timedDelete({ timeout: 5000 }));

        const role = message.guild.roles.cache.find(r => r.name.toLowerCase() == message.args[0].toLowerCase()) ?? message.getRoles[0]

        if(!role) return message.channel.error('misc:ERROR_MESSAGE', { ERROR: "Role not found" }).then(m => m.timedDelete({ timeout: 5000 }));


        if (message.member.permissions.has('ADMINISTRATOR') || role.comparePositionTo(message.guild.me.roles.highest) >= 0) {
			switch (message.args[1].toLowerCase()) {
				case 'colour':

				case 'color':
						fs.readFile('./src/assets/json/colours.json', async (err, data) => {
							if (err) {
								bot.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
								return message.channel.error('misc:ERROR_MESSAGE', { ERROR: err.message }).then(m => m.timedDelete({ timeout: 5000 }));
							}
				
							// Retrieve the names of colours
							const { colourNames } = JSON.parse(data);
							const colour = (message.args[2].toLowerCase()).replace(/\s/g, '');
							if(colourNames[colour] ?? /[0-9A-Fa-f]{6}/g.test(message.args[2])) {
								role.edit( { color: colourNames[colour] ?? message.args[2] } )
								message.channel.success('moderation/kick:SUCCESS', { REASON: "Role successfully edited" }).then(m => m.timedDelete({ timeout: 3000 }));
							} else return message.channel.error('misc:ERROR_MESSAGE', { ERROR: "Colour not found" }).then(m => m.timedDelete({ timeout: 5000 }));
						})
					break
				case 'hoist':
					if(Boolean(message.args[2]) === message.args[2]) return message.channel.error('misc:ERROR_MESSAGE', { ERROR: "Please provide the boolean as a value" }).then(m => m.timedDelete({ timeout: 5000 }));
					role.edit( { hoist: message.args[2] } )
					message.channel.success('moderation/kick:SUCCESS', { REASON: "Role successfully edited" }).then(m => m.timedDelete({ timeout: 3000 }));
					break
				case 'name':
				
				case 'rename':
					if(message.args[2].length > 100) return message.channel.error('misc:ERROR_MESSAGE', { ERROR: "The role name is greater than the character limit of (100)" }).then(m => m.timedDelete({ timeout: 5000 }));
					role.edit( { name: message.args[2] })
					message.channel.success('moderation/kick:SUCCESS', { REASON: "Role successfully edited" }).then(m => m.timedDelete({ timeout: 3000 }));
					break
				default:
					return message.channel.error('misc:INCORRECT_FORMAT', { EXAMPLE: settings.prefix.concat(message.translate('tags/tags:USAGE')) }).then(m => m.timedDelete({ timeout: 5000 }));
			}
        }
	}
};
