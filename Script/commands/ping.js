module.exports.config = {
	name: "ping",
	version: "1.0.4",
	hasPermssion: 1,
	credits: "Mirai Team",
	description: "Tag toàn bộ thành viên trong nhóm",
	commandCategory: "system",
	usages: "[Text]",
	cooldowns: 80
};

module.exports.languages = {
	en: {
		defaultText: "@everyone",
		error: "❌ Something went wrong while tagging."
	},
	vi: {
		defaultText: "@mọi người",
		error: "❌ Có lỗi xảy ra khi tag mọi người."
	},
	ar: {
		defaultText: "@الجميع",
		error: "❌ حدث خطأ أثناء عمل التاج للجميع."
	}
};

module.exports.run = async function({ api, event, args, getText }) {
	try {
		const botID = api.getCurrentUserID();
		const listUserID = event.participantIDs.filter(ID => ID !== botID && ID !== event.senderID);
		const message = args.length !== 0 ? args.join(" ") : getText("defaultText");

		let body = "‎" + message;
		let mentions = [];
		let index = 0;

		for (const idUser of listUserID) {
			mentions.push({ id: idUser, tag: "‎", fromIndex: index - 1 });
			index -= 1;
		}

		return api.sendMessage({ body, mentions }, event.threadID, event.messageID);

	} catch (e) {
		console.error(e);
		return api.sendMessage(getText("error"), event.threadID, event.messageID);
	}
};
