module.exports.config = {
	name: "run",
	version: "1.0.2",
	hasPermssion: 2, // Only bot admins
	credits: "Mirai Team",
	description: "Execute shell-level JS code (owner only)",
	commandCategory: "system",
	usages: "[script]",
	cooldowns: 5
};

module.exports.languages = {
	en: {
		missingCode: "⚠️ Please provide code to execute.",
		noOutput: "✅ Executed successfully. No output.",
		error: "❌ Error: %1"
	},
	vi: {
		missingCode: "⚠️ Vui lòng nhập đoạn mã cần thực thi.",
		noOutput: "✅ Đã thực thi thành công. Không có kết quả trả về.",
		error: "❌ Lỗi: %1"
	},
	ar: {
		missingCode: "⚠️ الرجاء إدخال الكود المراد تنفيذه.",
		noOutput: "✅ تم التنفيذ بنجاح. لا يوجد ناتج.",
		error: "❌ خطأ: %1"
	}
};

module.exports.run = async function({ api, event, args, Threads, Users, Currencies, models, getText }) {
	const evalCode = args.join(" ");
	if (!evalCode) return api.sendMessage(getText("missingCode"), event.threadID, event.messageID);

	try {
		const output = await eval(`(async () => { ${evalCode} })()`, {
			api,
			event,
			args,
			Threads,
			Users,
			Currencies,
			models,
			global
		}, true);

		let result;
		if (typeof output === "object") {
			result = JSON.stringify(output, null, 2);
		} else if (typeof output === "undefined" || output === null) {
			result = getText("noOutput");
		} else {
			result = output.toString();
		}

		api.sendMessage(result, event.threadID, event.messageID);
	} catch (err) {
		api.sendMessage(getText("error", err.message), event.threadID, event.messageID);
	}
};
