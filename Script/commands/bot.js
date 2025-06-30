const randomReplies = [
  "হ্যাঁ 😀, আমি এখানে আছি",
  "কেমন আছো?",
  "বলো জান কি করতে পারি তোমার জন্য",
  ({ body }) => `তুমি বলেছো: "${body}"? কিউট!`,
  "I love you 💝",
  "ভালোবাসি তোমাকে 🤖",
  "Hi, I'm messenger Bot, I can help you.?🤖",
  "Use callad to contact admin!",
  "Hi, Don't disturb 🤖 🚘 Now I'm going to Feni, Bangladesh..bye",
  "Hi, 🤖 I can help you~~~~",
  "আমি এখন আমিনুল বসের সাথে বিজি আছি",
  "আমাকে আমাকে না ডেকে আমার বসকে ডাকো এই নেও LINK :- https://www.facebook.com/100071880593545",
  "Hmmm sona 🖤 meye hoile kule aso ar sele hoile kule new 🫂😘",
  "Yah This Bot creator : PRINCE RID((A.R))     link => https://www.facebook.com/100071880593545",
  "হা বলো, শুনছি আমি 🤸‍♂️🫂",
  "Ato daktasen kn bujhlam na 😡",
  "jan bal falaba,🙂",
  "ask amr mon vlo nei dakben na🙂",
  "Hmm jan ummah😘😘",
  "jang hanga korba 🙂🖤",
  "iss ato dako keno lojja lage to 🫦🙈",
  "suna tomare amar valo lage,🙈😽"
];

module.exports.config = {
  name: "bot",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Aminul Sordar",
  description: "Bot will reply with cute random texts",
  commandCategory: "fun",
  usages: "",
  cooldowns: 3
};

module.exports.languages = {
  vi: {
    description: "Bot sẽ trả lời bằng những câu ngẫu nhiên dễ thương."
  },
  en: {
    description: "Bot will reply with cute and random messages."
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, body } = event;

  const reply = (() => {
    const pick = randomReplies[Math.floor(Math.random() * randomReplies.length)];
    return typeof pick === "function" ? pick({ body }) : pick;
  })();

  return api.sendMessage(reply, threadID, messageID);
};
