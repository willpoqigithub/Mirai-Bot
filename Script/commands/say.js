module.exports.config = {
	name: "say",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Bot speaks using Google TTS (Text-to-Speech)",
	commandCategory: "media",
	usages: "[ru/en/ko/ja] [Text]",
	cooldowns: 5,
	dependencies: {
		"path": "",
		"fs-extra": ""
	}
};

module.exports.languages = {
	en: {
		missingText: "Please provide text for me to speak.",
		error: "Something went wrong while generating the voice."
	},
	vi: {
		missingText: "Vui lòng nhập nội dung để tôi nói.",
		error: "Đã xảy ra lỗi khi tạo giọng nói."
	},
	ar: {
		missingText: "يرجى إدخال النص الذي تريدني أن أنطقه.",
		error: "حدث خطأ أثناء توليد الصوت."
	}
};

module.exports.run = async function({ api, event, args, getText }) {
	const { createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
	const { resolve } = global.nodemodule["path"];

	try {
		let content = (event.type === "message_reply") ? event.messageReply.body : args.join(" ");
		if (!content) return api.sendMessage(getText("missingText"), event.threadID, event.messageID);

		// Detect language
		let langCode = global.config.language || "en";
		const supportedLangs = ["ru", "en", "ko", "ja"];
		if (supportedLangs.includes(content.slice(0, 2).toLowerCase())) {
			langCode = content.slice(0, 2).toLowerCase();
			content = content.slice(3).trim();
		}

		if (!content) return api.sendMessage(getText("missingText"), event.threadID, event.messageID);

		const path = resolve(__dirname, "cache", `${event.threadID}_${event.senderID}.mp3`);
		const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(content)}&tl=${langCode}&client=tw-ob`;

		await global.utils.downloadFile(ttsUrl, path);

		return api.sendMessage(
			{ attachment: createReadStream(path) },
			event.threadID,
			() => unlinkSync(path),
			event.messageID
		);
	} catch (err) {
		console.error("say.js error:", err);
		return api.sendMessage(getText("error"), event.threadID, event.messageID);
	}
};
