module.exports.config = {
	name: "rname",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Random biệt danh tiếng NHẬT 🤔",
	commandCategory: "other",
	cooldowns: 5,
	dependencies: {
		"request": ""
	},
	envConfig: {
		"APIKEY": "mi451266190"
	}
};

module.exports.languages = {
	en: {
		success: "✅ Your new Japanese name is: %1",
		error: "❌ Failed to generate name. Please try again later."
	},
	vi: {
		success: "✅ Tên tiếng Nhật mới của bạn là: %1",
		error: "❌ Không thể tạo tên. Vui lòng thử lại sau."
	},
	ar: {
		success: "✅ اسمك الياباني الجديد هو: %1",
		error: "❌ فشل في توليد الاسم. الرجاء المحاولة مرة أخرى لاحقًا."
	}
};

module.exports.run = async ({ api, event, getText }) => {
	const request = global.nodemodule["request"];
	const apiKey = global.configModule[this.config.name].APIKEY;
	const url = `https://www.behindthename.com/api/random.json?usage=jap&gender=f&key=${apiKey}`;

	return request(url, (err, response, body) => {
		try {
			if (err || !body) throw new Error("Request failed");
			const data = JSON.parse(body);
			if (!data.names || data.names.length < 2) throw new Error("No names returned");

			const name = `${data.names[0]} ${data.names[1]}`;
			api.changeNickname(name, event.threadID, event.senderID, () => {
				api.sendMessage(getText("success", name), event.threadID, event.messageID);
			});
		} catch (e) {
			console.error(e);
			return api.sendMessage(getText("error"), event.threadID, event.messageID);
		}
	});
};
