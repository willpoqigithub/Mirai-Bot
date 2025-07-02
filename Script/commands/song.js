const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ytSearch = require("yt-search");
const { finished } = require("stream/promises");

module.exports.config = {
  name: "song",
  version: "1.0.0",
  hasPermssion: 0, // 0 = all members
  credits: "Aminul Sordar",
  description: "🎵 Search and play music or video from YouTube by song name",
  commandCategory: "media",
  usages: "[song name] [audio|video]",
  cooldowns: 5,
  dependencies: {
    axios: "^1.4.0",
    ytSearch: "^2.10.4"
  },
  envConfig: {}
};

module.exports.languages = {
  vi: {
    noInput: "❗ Vui lòng nhập tên bài hát.\n\nCách dùng: /song <tên bài hát> [audio|video]",
    searching: "🎧 Đang tìm kiếm bài hát, vui lòng đợi...",
    noResult: "❌ Không tìm thấy kết quả nào.",
    invalidType: "⚠️ Loại phương tiện không hợp lệ! Vui lòng chọn 'audio' hoặc 'video'.",
    error: "❌ Đã xảy ra lỗi khi phát bài hát:\n%s",
    nowPlaying: "🎶 Đang phát: %1$s",
  },
  en: {
    noInput: "❗ Please provide a song name.\n\nUsage: /song <song name> [audio|video]",
    searching: "🎧 Searching for the song, please wait...",
    noResult: "❌ No results found.",
    invalidType: "⚠️ Invalid media type! Please choose 'audio' or 'video'.",
    error: "❌ Error occurred while playing song:\n%s",
    nowPlaying: "🎶 Now playing: %1$s",
  }
};

module.exports.onLoad = function () {
  console.log("[ SONG MODULE ] Loaded successfully ✅");
};

module.exports.handleReaction = function () {
  // Reaction handlers if needed
};

module.exports.handleReply = function () {
  // Reply handlers if needed
};

module.exports.handleEvent = function () {
  // Event handlers if needed
};

module.exports.handleSedule = function () {
  // Scheduled tasks if needed
};

module.exports.run = async function({ api, event, args, getText }) {
  const { threadID, messageID } = event;

  try {
    if (!args.length) {
      return api.sendMessage(getText("noInput"), threadID, messageID);
    }

    // Determine type audio or video, default to audio
    let type = "audio";
    const lastArg = args[args.length - 1].toLowerCase();
    if (["audio", "video"].includes(lastArg)) {
      type = lastArg;
      args.pop();
    }

    if (!["audio", "video"].includes(type)) {
      return api.sendMessage(getText("invalidType"), threadID, messageID);
    }

    const songName = args.join(" ");

    // Send waiting message
    const waitingMsg = await api.sendMessage(getText("searching"), threadID, messageID);

    // Search YouTube
    const searchResults = await ytSearch(songName);

    if (!searchResults || !searchResults.videos.length) {
      return api.sendMessage(getText("noResult"), threadID, messageID);
    }

    const topResult = searchResults.videos[0];
    const videoId = topResult.videoId;

    // Set "loading" reaction
    await api.setMessageReaction("⏳", messageID, () => {}, true);

    // Download URL via Aryan's API
    const apiUrl = `https://noobs-xyz-aryan.vercel.app/youtube?id=${videoId}&type=${type}&apikey=itzaryan`;
    const downloadResponse = await axios.get(apiUrl);

    if (!downloadResponse.data || !downloadResponse.data.downloadUrl) {
      throw new Error("Download URL not found from API");
    }

    const downloadUrl = downloadResponse.data.downloadUrl;

    // Sanitize filename
    const safeTitle = topResult.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 50) || "song";
    const ext = type === "audio" ? ".mp3" : ".mp4";
    const filepath = path.join(__dirname, safeTitle + ext);

    // Download file as stream
    const fileResponse = await axios.get(downloadUrl, { responseType: "stream" });
    const writer = fs.createWriteStream(filepath);
    fileResponse.data.pipe(writer);

    // Wait until file fully downloaded
    await finished(writer);

    // Set success reaction
    await api.setMessageReaction("✅", messageID, () => {}, true);

    // Send the media file with now playing message
    await api.sendMessage(
      {
        body: getText("nowPlaying", topResult.title),
        attachment: fs.createReadStream(filepath)
      },
      threadID,
      (err) => {
        if (err) console.error("❌ Error sending media:", err.message);

        // Delete temp file asynchronously
        fs.unlink(filepath, (unlinkErr) => {
          if (unlinkErr) console.error("❌ Failed to delete temp file:", unlinkErr.message);
        });

        // Remove waiting message
        if (waitingMsg && waitingMsg.messageID) {
          api.unsendMessage(waitingMsg.messageID);
        }
      },
      messageID
    );

  } catch (error) {
    console.error("❌ Error in song command:", error);
    return api.sendMessage(getText("error", error.message), threadID, messageID);
  }
};
