const languageData = {
	EVAL_NO_OWNER: '**What do you think you\'re doing?**',
	EVAL_ERROR: (error) => `Error whilst evaluating: \`${error}\``,
	EVAL_RESPONSE: (diff) => `*Executed in ${diff[0][0] > 0 ? `${diff[0][0]}s` : ''}${diff[0][1] / 1000000}ms.*\`\`\`javascript\n${diff[1]}\n\`\`\``,
	RELOAD_ERROR: (name) => `Could not reload: \`${name}\`.`,
	RELOAD_NO_COMMAND: (name) => `${name} isn't a command.`,
	RELOAD_SUCCESS: (name) => `Command: \`${name}\` has been reloaded.`,
	RELOAD_SUCCESS_EVENT: (name) => `Event: \`${name}\` has been reloaded.`,
	SHUTDOWN: 'Oh.. ok goodbye :disappointed_relieved:',
	SHUTDOWN_ERROR: (error) => `ERROR: ${error}`,
};

const translate = (key, args) => {
	const translation = languageData[key];
	if(typeof translation === 'function') return translation(args);
	else return translation;
};

module.exports = translate;
