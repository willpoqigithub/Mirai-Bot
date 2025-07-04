module.exports.config = {
	name: "frok",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "Aminul Sordar",
	description: "📦 Show all Aminul's bot forks with no prefix",
	commandCategory: "system",
	usages: "Just type: frok, forklink, githublink...",
	cooldowns: 5
};

module.exports.languages = {
	en: {
		title: "🤖 Aminul's GitHub Bot Forks",
		list: `🔹 Mirai-Bot\n🌐 https://github.com/Aminulsordar/Mirai-Bot

🔹 Auto-Bot\n🌐 https://github.com/Aminulsordar/Auto

🔹 GoatBot - AMINUL-X-BOT\n🌐 https://github.com/Aminulsordar/AMINUL-X-BOT

🔹 GoatBot Fix\n🌐 https://github.com/Aminulsordar/Gaot-fix`,
		footer: `📌 Facebook: https://www.facebook.com/profile.php?id=100071880593545
📌 GitHub: https://github.com/Aminulsordar`
	},
	ar: {
		title: "🤖 فوركات بوتات أمينول على GitHub",
		list: `🔹 Mirai-Bot\n🌐 https://github.com/Aminulsordar/Mirai-Bot

🔹 Auto-Bot\n🌐 https://github.com/Aminulsordar/Auto

🔹 GoatBot - AMINUL-X-BOT\n🌐 https://github.com/Aminulsordar/AMINUL-X-BOT

🔹 GoatBot Fix\n🌐 https://github.com/Aminulsordar/Gaot-fix`,
		footer: `📌 فيسبوك: https://www.facebook.com/profile.php?id=100071880593545
📌 GitHub: https://github.com/Aminulsordar`
	},
	vi: {
		title: "🤖 Các bản fork bot của Aminul trên GitHub",
		list: `🔹 Mirai-Bot\n🌐 https://github.com/Aminulsordar/Mirai-Bot

🔹 Auto-Bot\n🌐 https://github.com/Aminulsordar/Auto

🔹 GoatBot - AMINUL-X-BOT\n🌐 https://github.com/Aminulsordar/AMINUL-X-BOT

🔹 GoatBot Fix\n🌐 https://github.com/Aminulsordar/Gaot-fix`,
		footer: `📌 Facebook: https://www.facebook.com/profile.php?id=100071880593545
📌 GitHub: https://github.com/Aminulsordar`
	}
};

module.exports.handleEvent = async function ({ event, api, getText }) {
	const body = event.body?.toLowerCase() || "";
	const triggers = ["frok", "forklink", "myfrok", "githublink", "github"];

	if (triggers.some(trigger => body.startsWith(trigger))) {
		const message = `╭━〔 ${getText("title")} 〕━╮\n\n${getText("list")}\n\n━━━━━━━━━━━━━━━\n${getText("footer")}`;
		api.sendMessage(message, event.threadID, event.messageID);
	}
};

module.exports.run = () => {}; // Not used (no-prefix only)
