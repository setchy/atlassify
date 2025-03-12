import twemoji, { type TwemojiOptions } from "@discordapp/twemoji";

import { Constants } from "./constants";
import { Errors } from "./errors";

const EMOJI_FORMAT = "svg";

const ALL_EMOJIS = [
	...Constants.ALL_READ_EMOJIS,
	...Errors.BAD_CREDENTIALS.emojis,
	...Errors.BAD_REQUEST.emojis,
	...Errors.NETWORK.emojis,
	...Errors.UNKNOWN.emojis,
];

export const ALL_EMOJI_SVG_FILENAMES = ALL_EMOJIS.map(async (emoji) => {
	const imgHtml = convertTextToEmojiImgHtml(emoji);
	return extractSvgFilename(await imgHtml);
});

export async function convertTextToEmojiImgHtml(text: string): Promise<string> {
	// return text;

	const directory = await window.atlassify.twemojiDirectory();

	console.log("ADAM DIR", directory);

	return twemoji.parse(text, {
		folder: EMOJI_FORMAT,
		callback: (icon: string, _options: TwemojiOptions) => {
			return `${directory}/${icon}.${EMOJI_FORMAT}`;
		},
	});
}

function extractSvgFilename(imgHtml: string): string {
	const srcMatch = /src="(.*)"/.exec(imgHtml);
	const src = srcMatch ? srcMatch[1] : "";
	const filename = src.split("/").pop(); // Get the last part after splitting by "/"
	return filename;
}
