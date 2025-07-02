const axios = require("axios");

async function getBaseApiUrl() {
  try {
    const res = await axios.get(
      "https://raw.githubusercontent.com/itzaryan008/ERROR/refs/heads/main/raw/api.json"
    );
    return res.data.apis + "/gemini";
  } catch (err) {
    console.error("❌ Failed to fetch Gemini API:", err.message);
    return null;
  }
}

module.exports.config = {
  name: "gemini",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "ArYAN - Decor by Aminul Sordar",
  description: "🤖 Chat with Gemini AI using text or image input!",
  commandCategory: "🤖 AI-Chat",
  usages: "[prompt] | reply image",
  cooldowns: 5,
  dependencies: {
    axios: ""
  },
  envConfig: {}
};

module.exports.languages = {
  "vi": {
    noPrompt: "⚠️ Vui lòng nhập nội dung hoặc trả lời một ảnh!",
    errorAPI: "❌ Không thể kết nối tới API Gemini.",
    noResponse: "🤖 Không có phản hồi từ Gemini.",
    imageFailed: "🖼️ Lỗi khi xử lý ảnh với Gemini."
  },
  "en": {
    noPrompt: "⚠️ Please provide a prompt or reply to an image!",
    errorAPI: "❌ Failed to connect to Gemini API.",
    noResponse: "🤖 No response from Gemini.",
    imageFailed: "🖼️ Failed to process the image with Gemini."
  }
};

module.exports.onLoad = function () {
  console.log("✅ Gemini module loaded successfully.");
};

module.exports.handleReaction = function () { };
module.exports.handleReply = function () { };
module.exports.handleEvent = function () { };
module.exports.handleSchedule = function () { };

module.exports.run = async function ({ api, event, args, getText }) {
  const BASE_API_URL = await getBaseApiUrl();
  if (!BASE_API_URL) {
    return api.sendMessage("🚨 " + getText("errorAPI"), event.threadID, event.messageID);
  }

  const prompt = args.join(" ").trim();

  const isImageReply =
    event.type === "message_reply" &&
    event.messageReply.attachments?.length > 0 &&
    event.messageReply.attachments[0].type === "photo";

  // 🧩 Validate prompt or image
  if (!prompt && !isImageReply) {
    return api.sendMessage("💡 " + getText("noPrompt"), event.threadID, event.messageID);
  }

  // 🖼️ Handle image input
  if (isImageReply) {
    const imageUrl = event.messageReply.attachments[0].url;
    try {
      const res = await axios.get(
        `${BASE_API_URL}?ask=${encodeURIComponent(prompt || "Describe this image")}&url=${encodeURIComponent(imageUrl)}`
      );
      const reply = res.data?.gemini || getText("noResponse");
      return api.sendMessage(`🧠 Gemini Says:\n\n${reply}`, event.threadID, event.messageID);
    } catch (err) {
      console.error("❌ Gemini Image Error:", err.message);
      return api.sendMessage("🚫 " + getText("imageFailed"), event.threadID, event.messageID);
    }
  }

  // 💬 Handle text input
  try {
    const res = await axios.get(`${BASE_API_URL}?ask=${encodeURIComponent(prompt)}`);
    const reply = res.data?.gemini || getText("noResponse");
    return api.sendMessage(`🧠 Gemini Says:\n\n${reply}`, event.threadID, event.messageID);
  } catch (err) {
    console.error("❌ Gemini Text Error:", err.message);
    return api.sendMessage("🚫 " + getText("errorAPI"), event.threadID, event.messageID);
  }
};
