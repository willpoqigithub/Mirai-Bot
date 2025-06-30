const axios = require("axios");

module.exports.config = {
  name: "gpt",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Aminul Sordar",
  description: "Ask ChatGPT using Aryan API 🤖",
  commandCategory: "ai",
  usages: "[your question]",
  cooldowns: 3
};

module.exports.languages = {
  en: {
    noQuery: "❌ Please provide a question to ask GPT.",
    thinking: "🤖 Thinking... Please wait...",
    error: "❌ An error occurred while getting a response."
  },
  vi: {
    noQuery: "❌ Vui lòng nhập câu hỏi để hỏi GPT.",
    thinking: "🤖 Đang suy nghĩ... Vui lòng chờ...",
    error: "❌ Có lỗi xảy ra khi lấy câu trả lời."
  },
  bn: {
    noQuery: "❌ প্রশ্নটি লিখুন যা GPT-কে জিজ্ঞাসা করতে চান।",
    thinking: "🤖 ভাবছে... অনুগ্রহ করে অপেক্ষা করুন...",
    error: "❌ উত্তর আনতে সমস্যা হয়েছে।"
  }
};

module.exports.run = async ({ api, event, args, getText }) => {
  const question = args.join(" ");

  if (!question)
    return api.sendMessage(getText("noQuery"), event.threadID, event.messageID);

  api.sendMessage(getText("thinking"), event.threadID, event.messageID);

  try {
    const uid = event.senderID || "defaultUser";
    const res = await axios.get(`https://api-aryan-xyz.vercel.app/chatgpt`, {
      params: {
        ask: question,
        uid
      },
      headers: {
        apikey: "ArYAN"
      }
    });

    if (!res.data || !res.data.reply) {
      return api.sendMessage(getText("error"), event.threadID, event.messageID);
    }

    return api.sendMessage(`🤖 ChatGPT says:\n\n${res.data.reply}`, event.threadID, event.messageID);
  } catch (err) {
    console.error("GPT Error:", err);
    return api.sendMessage(getText("error"), event.threadID, event.messageID);
  }
};
