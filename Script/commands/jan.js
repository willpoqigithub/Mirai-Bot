const axios = require("axios");

module.exports.config = {
  name: "jan",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "Aminul Sordar",
  description: {
    en: "Chat with Jan - smart AI + random SMS + continuous reply",
    vi: "Trò chuyện với Jan - AI thông minh + tin nhắn ngẫu nhiên + trả lời liên tục",
    default: "jan এর সাথে চ্যাট করো - smart AI + random sms + continuous reply"
  },
  commandCategory: "fun",
  usages: "jan [message]",
  cooldowns: 3
};

module.exports.languages = {
  en: {
    notEnoughWords: "Please type more than 3 characters for me to answer.",
    apiError: "❌ Could not get answer from server, please try again later!",
    defaultAnswer: "❌ I haven't learned this yet, teach me! 👀"
  },
  vi: {
    notEnoughWords: "Vui lòng nhập nhiều hơn 3 ký tự để tôi trả lời.",
    apiError: "❌ Không thể lấy câu trả lời từ máy chủ, vui lòng thử lại sau!",
    defaultAnswer: "❌ Tôi chưa học được điều này, hãy dạy tôi! 👀"
  },
  default: {
    notEnoughWords: "তিনটি অক্ষরের বেশি লিখুন যাতে আমি উত্তর দিতে পারি।",
    apiError: "❌ সার্ভার থেকে উত্তর পাওয়া যায়নি, পরে আবার চেষ্টা করুন!",
    defaultAnswer: "❌ আমি এখনো এটা শিখিনি, আমাকে শেখাও! 👀"
  }
};

module.exports.handleEvent = async function({ api, event, getLang }) {
  const { body = "", threadID, messageID, senderID } = event;
  const lang = getLang ? getLang() : "default";

  const lower = body.toLowerCase();
  const triggerWords = ["jan", "bby", "baby", "sona"];
  if (!triggerWords.some(word => lower.startsWith(word))) return;

  // Extract question part: e.g. "jan কি করো" → "কি করো"
  const args = body.trim().split(/\s+/);
  const question = args.slice(1).join(" ").trim();

  if (question.length > 3) {
    // Ask API for answer
    try {
      const res = await axios.get(`https://jan-api-by-aminul-sordar.vercel.app/answer/${encodeURIComponent(body)}`);
      const answer = res.data.answer || this.languages[lang].defaultAnswer;
      return api.sendMessage(`🤖 ${answer}`, threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: senderID
          });
        }
      }, messageID);
    } catch (e) {
      console.error("API error:", e.message);
      return api.sendMessage(this.languages[lang].apiError, threadID, messageID);
    }
  }

  // If no valid question, send random reply
  const replies = [
    "হ্যাঁ 😀, আমি এখানে আছি",
    "কেমন আছো?",
    "বলো জান কি করতে পারি তোমার জন্য",
    `তুমি বলেছো: "${body}"? কিউট!`,
    "I love you 💝",
    "ভালোবাসি তোমাকে 🤖",
    "Hi, I'm messenger Bot, I can help you.?🤖",
    "Use callad to contact admin!",
    "Hi, Don't disturb 🤖 🚘 Now I'm going to Feni, Bangladesh..bye",
    "Hi, 🤖 I can help you~~~~",
    "আমি এখন আমিনুল বসের সাথে বিজি আছি",
    "আমাকে না ডেকে আমার বসকে ডাকো এই নেও LINK :- https://www.facebook.com/100071880593545",
    "Hmmm sona 🖤 meye hoile kule aso ar sele hoile kule new 🫂😘",
    "Yah This Bot creator : PRINCE RID((A.R))     link => https://www.facebook.com/100071880593545",
    "হা বলো, শুনছি আমি 🤸‍♂️🫂",
    "Ato daktasen kn bujhlam na 😡",
    "jan bal falaba,🙂",
    "ask amr mon vlo nei dakben na🙂",
    "Hmm jan ummah😘😘",
    "jang hanga korba 🙂🖤",
    "iss ato dako keno loj্জা লাগে to 🫦🙈",
    "suna tomare amar valo lage,🙈😽"
  ];

  const replyText = replies[Math.floor(Math.random() * replies.length)];
  return api.sendMessage(replyText, threadID, (err, info) => {
    if (!err) {
      global.client.handleReply.push({
        name: module.exports.config.name,
        messageID: info.messageID,
        author: senderID
      });
    }
  }, messageID);
};

module.exports.handleReply = async function({ api, event, handleReply, getLang }) {
  const { senderID, body, threadID, messageID } = event;
  const lang = getLang ? getLang() : "default";

  if (senderID !== handleReply.author) return;

  try {
    const res = await axios.get(`https://jan-api-by-aminul-sordar.vercel.app/answer/${encodeURIComponent(body)}`);
    const answer = res.data.answer || this.languages[lang].defaultAnswer;

    return api.sendMessage(`🤖 ${answer}`, threadID, (err, info) => {
      if (!err) {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: senderID
        });
      }
    }, messageID);
  } catch (e) {
    console.error("API error:", e.message);
    return api.sendMessage(this.languages[lang].apiError, threadID, messageID);
  }
};

module.exports.run = () => {};
