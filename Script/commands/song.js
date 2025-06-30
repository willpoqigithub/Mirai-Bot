const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "song",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Aminul Sordar",
  description: "Search and download songs from YouTube 🎵",
  commandCategory: "media",
  usages: "[song name]",
  cooldowns: 5
};

module.exports.languages = {
  en: {
    noQuery: "❌ Please enter a song name to search.",
    searching: "🔍 Searching for your song...",
    notFound: "❌ No result found for your song.",
    downloading: "🎶 Downloading your song, please wait...",
    error: "❌ Failed to fetch or download the song."
  },
  vi: {
    noQuery: "❌ Vui lòng nhập tên bài hát.",
    searching: "🔍 Đang tìm kiếm bài hát...",
    notFound: "❌ Không tìm thấy bài hát.",
    downloading: "🎶 Đang tải bài hát, vui lòng chờ...",
    error: "❌ Không thể tải bài hát."
  },
  bn: {
    noQuery: "❌ গানটির নাম দিন।",
    searching: "🔍 আপনার গান খোঁজা হচ্ছে...",
    notFound: "❌ আপনার গানের জন্য কিছু পাওয়া যায়নি।",
    downloading: "🎶 গান ডাউনলোড করা হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।",
    error: "❌ গান আনতে সমস্যা হয়েছে।"
  }
};

module.exports.run = async ({ api, event, args, getText }) => {
  const query = args.join(" ");

  if (!query)
    return api.sendMessage(getText("noQuery"), event.threadID, event.messageID);

  api.sendMessage(getText("searching"), event.threadID, event.messageID);

  try {
    const searchRes = await axios.get(`https://api-aryan-xyz.vercel.app/ytsearch?query=${encodeURIComponent(query)}`, {
      headers: {
        apikey: "ArYAN"
      }
    });

    const result = searchRes.data?.result?.[0];
    if (!result || !result.videoId)
      return api.sendMessage(getText("notFound"), event.threadID, event.messageID);

    const videoId = result.videoId;
    const title = result.title;

    api.sendMessage(getText("downloading"), event.threadID, event.messageID);

    const audioRes = await axios.get(`https://api-aryan-xyz.vercel.app/youtube?id=${videoId}`, {
      responseType: "arraybuffer",
      headers: {
        apikey: "ArYAN"
      }
    });

    const audioPath = path.join(__dirname, "cache", `song-${Date.now()}.mp3`);
    fs.writeFileSync(audioPath, Buffer.from(audioRes.data, "utf-8"));

    return api.sendMessage({
      body: `🎵 Now playing: ${title}`,
      attachment: fs.createReadStream(audioPath)
    }, event.threadID, () => fs.unlinkSync(audioPath), event.messageID);

  } catch (err) {
    console.error("Song error:", err);
    return api.sendMessage(getText("error"), event.threadID, event.messageID);
  }
};
