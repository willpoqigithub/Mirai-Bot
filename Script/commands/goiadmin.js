module.exports.config = {
  name: "goiadmin",
  version: "1.0.0-beta-fixbyDungUwU",
  hasPermssion: 0,
  credits: "ZyrosGenZ - fix by DungUwU",
  description: "Bot will respond when someone tags admin or bot",
  commandCategory: "Other",
  usages: "",
  cooldowns: 1
};

module.exports.languages = {
  en: {
    message: "Don't mention the admin unnecessarily!"
  },
  vi: {
    message: "Đừng tag admin một cách không cần thiết!"
  }
};

module.exports.handleEvent = function({ api, event }) {
  const adminIDs = ["100050450796007", "100071880593545"];
  const mentionIDs = Object.keys(event.mentions || {});
  
  // Check if message contains any of the admin IDs
  if (mentionIDs.some(id => adminIDs.includes(id))) {
    const responses = [
      "বস, আমিনুল সিংগেল পোলা তাকে একটা গফ দেও 🥺",
      "আমার বস আমিনুলকে আর একবার মেনশন দিলে তোমার নাকের মধ্যে ঘুষি মারমু 😡",
      "বস আমিনুলকে আর একবার মেনশন দিলে খবর আছে তোমার, ঘুষি মারমু! 😠",
      "বস আমিনুল এখন অনেক বিজি, মেনশন দিয়া ডিস্টার্ব কইরো না 🥰😍😏",
      "বস, আমিনুলকে এখন অনেক বিজি, তাকে মেনশন দিবা না 😡😡😡"
    ];
    
    const randomMsg = responses[Math.floor(Math.random() * responses.length)];
    return api.sendMessage(randomMsg, event.threadID, event.messageID);
  }
};

module.exports.run = async function() {};
