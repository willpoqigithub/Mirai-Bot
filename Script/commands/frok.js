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

module.exports.handleEvent = async function ({ event, api }) {
	const body = event.body || "";
	const triggers = ["frok", "forklink", "myfrok", "githublink", "github"];

	if (triggers.some(trigger => body.toLowerCase().startsWith(trigger))) {
		api.sendMessage(`🤖 Aminul's GitHub Bot Forks:

🔹 Mirai-Bot
🌐 https://github.com/Aminulsordar/Mirai-Bot

🔹 Auto-Bot
🌐 https://github.com/Aminulsordar/Auto

🔹 GoatBot - AMINUL-X-BOT
🌐 https://github.com/Aminulsordar/AMINUL-X-BOT

🔹 GoatBot Fix
🌐 https://github.com/Aminulsordar/Gaot-fix

━━━━━━━━━━━━━━━

📌 Facebook: https://www.facebook.com/profile.php?id=100071880593545
📌 GitHub: https://github.com/Aminulsordar`, event.threadID, event.messageID);
	}
};

module.exports.run = async function () {
	// Not used — handled via no-prefix keywords in handleEvent
};
