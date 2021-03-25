const languageData = {
	GENERATING_IMAGE: 'Generating your image..',
	TEXT_OVERLOAD: (number) => `Your message must not be more than ${number} characters.`,
	GENERATE_DESC: (images) => `**1 Image is needed**:\n\`${images[0]}\`. \n**2 images is needed**:\n\`${images[1]}\`.`,
	INVALID_FILE: 'That file format is not currently supported.',
	MISSING_ARGS: 'Please upload a file or mention a user.',
	NEED_2IMG: 'Please upload 2 files or mention 2 users.',
};

const translate = (key, args) => {
	const translation = languageData[key];
	if(typeof translation === 'function') return translation(args);
	else return translation;
};

module.exports = translate;
