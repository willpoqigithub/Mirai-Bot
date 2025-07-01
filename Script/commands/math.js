const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
	name: "math",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "Mirai Team (Decorated by Aminul)",
	description: "Solve math expressions via WolframAlpha",
	commandCategory: "study",
	usages: "math 1 + 2 | math -g y = x^2",
	cooldowns: 5,
	dependencies: {
		"axios": "",
		"fs-extra": ""
	},
	info: [
		{ key: 'none', prompt: '', type: 'Phép toán', example: 'math x+1=2' },
		{ key: '-p', prompt: 'Nguyên Hàm', type: 'Phương trình', example: 'math -p xdx' },
		{ key: '-p', prompt: 'Tích Phân', type: 'Phương trình', example: 'math -p xdx from 0 to 2' },
		{ key: '-g', prompt: 'Đồ Thị', type: 'Phương trình', example: 'math -g y = x^3 - 9' },
		{ key: '-v', prompt: 'Vector', type: 'Tọa độ vector', example: 'math -v (1, 2, 3) - (5, 6, 7)' }
	],
	envConfig: {
		"WOLFRAM": "T8J8YV-H265UQ762K"
	}
};

module.exports.languages = {
	en: {
		noInput: "❌ Please enter a math expression!",
		error: "⚠️ An error occurred while processing your request."
	},
	ar: {
		noInput: "❌ يرجى إدخال معادلة رياضية!",
		error: "⚠️ حدث خطأ أثناء معالجة طلبك."
	},
	vi: {
		noInput: "❌ Vui lòng nhập phép toán!",
		error: "⚠️ Đã xảy ra lỗi khi xử lý yêu cầu của bạn."
	}
};

module.exports.run = async function ({ api, event, args, getText }) {
	const { threadID, messageID, type, messageReply } = event;
	const out = msg => api.sendMessage(msg, threadID, messageID);
	const key = global.configModule.math.WOLFRAM;

	let content = (type === 'message_reply') ? messageReply.body : args.join(" ");
	if (!content) return out(getText("noInput"));

	// Handle -p (primitive/integral)
	if (content.startsWith("-p")) {
		try {
			content = "primitive " + content.slice(3).trim();
			const { data } = await axios.get(`http://api.wolframalpha.com/v2/query`, {
				params: {
					appid: key,
					input: content,
					output: "json"
				}
			});
			const pods = data.queryresult.pods;
			if (content.includes("from") && content.includes("to")) {
				const value = pods.find(e => e.id === "Input").subpods[0].plaintext;
				if (value.includes("≈")) {
					const [fractionalPart, decimalPart] = value.split("≈");
					const frac = fractionalPart.split(" = ")[1];
					const dec = decimalPart.trim();
					return out(`📐 Fractional: ${frac}\n🔢 Decimal: ${dec}`);
				} else return out("📐 Result: " + value.split(" = ")[1]);
			} else {
				const result = pods.find(e => e.id === "IndefiniteIntegral").subpods[0].plaintext;
				return out("∫ Result: " + result.split(" = ")[1].replace("+ constant", "").trim());
			}
		} catch (err) {
			console.error(err);
			return out(getText("error"));
		}
	}

	// Handle -g (graph)
	else if (content.startsWith("-g")) {
		try {
			content = "plot " + content.slice(3).trim();
			const { data } = await axios.get(`http://api.wolframalpha.com/v2/query`, {
				params: {
					appid: key,
					input: content,
					output: "json"
				}
			});
			const pods = data.queryresult.pods;
			const plotPod = pods.find(e => e.id === "Plot") || pods.find(e => e.id === "ImplicitPlot");
			const imgSrc = plotPod.subpods[0].img.src;
			const img = (await axios.get(imgSrc, { responseType: 'stream' })).data;
			const path = "./graph.png";
			img.pipe(fs.createWriteStream(path)).on("close", () => {
				api.sendMessage({ attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID);
			});
		} catch (err) {
			console.error(err);
			return out(getText("error"));
		}
	}

	// Handle -v (vector)
	else if (content.startsWith("-v")) {
		try {
			content = "vector " + content.slice(3).trim().replace(/\(/g, "<").replace(/\)/g, ">");
			const { data } = await axios.get(`http://api.wolframalpha.com/v2/query`, {
				params: {
					appid: key,
					input: content,
					output: "json"
				}
			});
			const pods = data.queryresult.pods;
			const imgSrc = pods.find(e => e.id === "VectorPlot").subpods[0].img.src;
			const length = pods.find(e => e.id === "VectorLength")?.subpods[0].plaintext;
			const result = pods.find(e => e.id === "Result")?.subpods[0].plaintext || '';
			const img = (await axios.get(imgSrc, { responseType: 'stream' })).data;
			const path = "./vector.png";
			img.pipe(fs.createWriteStream(path)).on("close", () => {
				api.sendMessage({
					body: `${result}\n📏 Vector Length: ${length}`,
					attachment: fs.createReadStream(path)
				}, threadID, () => fs.unlinkSync(path), messageID);
			});
		} catch (err) {
			console.error(err);
			return out(getText("error"));
		}
	}

	// Handle default: solve, equation, result
	else {
		try {
			const { data } = await axios.get(`http://api.wolframalpha.com/v2/query`, {
				params: {
					appid: key,
					input: content,
					output: "json"
				}
			});
			const pods = data.queryresult.pods;
			let output = "";

			if (pods.some(e => e.id === "Solution")) {
				const pod = pods.find(e => e.id === "Solution");
				output = pod.subpods.map(e => "🧮 " + e.plaintext).join("\n");
			}
			else if (pods.some(e => e.id === "ComplexSolution")) {
				const pod = pods.find(e => e.id === "ComplexSolution");
				output = pod.subpods.map(e => "🔮 " + e.plaintext).join("\n");
			}
			else if (pods.some(e => e.id === "Result")) {
				output = "✅ Result: " + pods.find(e => e.id === "Result").subpods[0].plaintext;
			}
			else {
				output = getText("error");
			}

			return out(output);
		} catch (err) {
			console.error(err);
			return out(getText("error"));
		}
	}
};
