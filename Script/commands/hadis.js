module.exports.config = {
	name: "hadis",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "BotolBaba",
	description: "Islamic Hadis.",
	commandCategory: "Religious",
	cooldowns: 5
};

module.exports.languages = {
	en: {
		description: "Get a random Hadith in Bengali"
	},
	ar: {
		description: "احصل على حديث عشوائي باللغة البنغالية"
	},
	vi: {
		description: "Lấy một Hadith ngẫu nhiên bằng tiếng Bengal"
	}
};

module.exports.run = function({ api, event }) {
	const axios = require("axios");
	const cheerio = require("cheerio");
	const url = `https://www.hadithbd.com/hadith/filter/?book=12&hadith=${Math.floor(Math.random() * 7563)}`;

	async function scrapeData() {
		try {
			const { data } = await axios.get(url);
			const $ = cheerio.load(data);
			const listItems = $("p");

			let msg = [];
			msg.push(listItems[0].children[1].data + "\n\n");

			const good = listItems[0].next.next.next.next.next.next.children;

			good.forEach(verygood);

			function verygood(arr) {
				if (arr.name === "p") {
					arr.children.forEach(vvgood);
				}
			}
			function vvgood(arrr) {
				if (arrr.type === "text") {
					msg.push(arrr.data);
				}
			}

			api.sendMessage(msg.join(""), event.threadID);
		} catch (err) {
			console.error(err);
			api.sendMessage("⚠️ Couldn't fetch the Hadith. Please try again later.", event.threadID);
		}
	}

	scrapeData();
};
