const axios = require("axios");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { createWriteStream } = require("fs");
const { get } = require("https");

module.exports.config = {
  name: "pin",
  version: "1.3.0",
  hasPermssion: 0,
  credits: "Aminul Sordar",
  description: "Search and send Pinterest images",
  commandCategory: "random-img",
  usages: "[keyword] - [count]",
  cooldowns: 5,
  dependencies: {},
  envConfig: {
    APIKEY: "ArYAN"
  }
};

module.exports.languages = {
  en: {
    missingKeyword: "⚠️ Please enter a search keyword.",
    error: "❌ Error occurred while fetching image.",
    noResult: "😿 No results found for this query."
  },
  vi: {
    missingKeyword: "⚠️ Vui lòng nhập từ khóa để tìm kiếm.",
    error: "❌ Đã xảy ra lỗi khi lấy ảnh.",
    noResult: "😿 Không tìm thấy kết quả."
  }
};

// 📥 Download Image and Return Stream
async function downloadImage(url) {
  const tempFile = path.join(os.tmpdir(), `${Date.now()}.jpg`);
  const writer = fs.createWriteStream(tempFile);

  return new Promise((resolve, reject) => {
    get(url, response => {
      response.pipe(writer);
      writer.on("finish", () => resolve(fs.createReadStream(tempFile)));
      writer.on("error", reject);
    }).on("error", reject);
  });
}

module.exports.onLoad = () => {
  console.log("✅ pin.js loaded - Powered by Aminul Sordar");
};

module.exports.run = async function ({ api, event, args, getText }) {
  const input = args.join(" ").split("-");
  const searchTerm = input[0]?.trim();
  const count = Math.min(parseInt(input[1]?.trim()) || 1, 50);
  const apikey = module.exports.config.envConfig.APIKEY;

  if (!searchTerm) {
    return api.sendMessage(getText("missingKeyword"), event.threadID, event.messageID);
  }

  try {
    const res = await axios.get("https://api-aryan-xyz.vercel.app/pin", {
      params: {
        search: searchTerm,
        apikey
      }
    });

    const results = res.data?.result;
    if (!results || results.length === 0) {
      return api.sendMessage(getText("noResult"), event.threadID, event.messageID);
    }

    const selected = results.slice(0, count);

    // Download and collect all image streams
    const attachments = await Promise.all(
      selected.map(url => downloadImage(url).catch(err => null))
    );

    const validAttachments = attachments.filter(a => a !== null);

    return api.sendMessage({
      body: `🎯 Pinterest Image Search\n🔍 Query: ${searchTerm}\n📷 Showing ${validAttachments.length}/${count} image(s)\n🔗 Powered by: api-aryan-xyz.vercel.app`,
      attachment: validAttachments
    }, event.threadID, event.messageID);

  } catch (err) {
    console.error("[PIN ERROR]", err);
    return api.sendMessage(getText("error"), event.threadID, event.messageID);
  }
};
