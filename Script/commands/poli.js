module.exports.config = {
  name: "poli",
  version: "1.0.1",
  hasPermission: 0,
  credits: "MIRAI-AMINUL",
  description: "Generate an image based on your prompt using Pollinations AI",
  commandCategory: "user",
  usages: "poli [text]",
  cooldowns: 2
};

module.exports.languages = {
  en: {
    missingInput: "⚠️ | Please provide some text to generate an image.",
    replySuccess: "✨ Here's your AI-generated image:"
  },
  vi: {
    missingInput: "⚠️ | Vui lòng nhập nội dung để tạo hình ảnh.",
    replySuccess: "✨ Đây là hình ảnh AI bạn yêu cầu:"
  }
};

module.exports.run = async ({ api, event, args, getText }) => {
  const axios = require("axios");
  const fs = require("fs-extra");
  const path = require("path");

  const { threadID, messageID } = event;
  const prompt = args.join(" ");

  if (!prompt) return api.sendMessage(getText("missingInput"), threadID, messageID);

  const imagePath = path.join(__dirname, "cache", `poli_${Date.now()}.png`);

  try {
    const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, {
      responseType: "arraybuffer"
    });

    fs.writeFileSync(imagePath, Buffer.from(response.data, "utf-8"));

    api.sendMessage({
      body: getText("replySuccess"),
      attachment: fs.createReadStream(imagePath)
    }, threadID, () => fs.unlinkSync(imagePath), messageID);

  } catch (error) {
    console.error("❌ Error fetching image from Pollinations:", error.message);
    api.sendMessage("❌ | Failed to generate image. Please try again later.", threadID, messageID);
  }
};
