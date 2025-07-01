const axios = require("axios");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

module.exports.config = {
  name: "install",
  version: "1.1.0",
  hasPermission: 2,
  credits: "Optimized by Aminul Sordar",
  usePrefix: true,
  description: "Create a new JS file from raw code or URL",
  commandCategory: "utility",
  usages: "[fileName.js] [link/code]",
  cooldowns: 5
};

module.exports.run = async ({ message, args, api, event }) => {
  const fileName = args[0];
  const contentInput = args.slice(1).join(" ");

  // ✅ Basic validation
  if (!fileName || !contentInput) {
    return api.sendMessage(
      "⚠️ একটি বৈধ .js ফাইল নাম ও কোড / কোড লিংক দিন!\nউদাহরণ:\ncreate test.js console.log('Hello')\nঅথবা\ncreate test.js https://pastebin.com/raw/abc123",
      event.threadID,
      event.messageID
    );
  }

  if (fileName.includes("..") || path.isAbsolute(fileName)) {
    return api.sendMessage(
      "❌ নিরাপত্তার কারণে এই ফাইল নামটি গ্রহণযোগ্য নয়!",
      event.threadID,
      event.messageID
    );
  }

  if (!fileName.endsWith(".js")) {
    return api.sendMessage(
      "❌ শুধু .js এক্সটেনশন গ্রহণযোগ্য!",
      event.threadID,
      event.messageID
    );
  }

  // 🧠 Determine if it's a URL or raw code
  const isURL = /^https?:\/\/[^ "]+$/.test(contentInput);
  let code;

  if (isURL) {
    if (
      !contentInput.startsWith("https://pastebin.com/raw/") &&
      !contentInput.startsWith("https://raw.githubusercontent.com/")
    ) {
      return api.sendMessage(
        "⚠️ শুধু Pastebin বা GitHub Raw লিংক গ্রহণযোগ্য!",
        event.threadID,
        event.messageID
      );
    }

    try {
      const res = await axios.get(contentInput);
      code = res.data;
    } catch (err) {
      return api.sendMessage(
        `❌ কোড ডাউনলোড করতে সমস্যা হয়েছে:\n${err.message}`,
        event.threadID,
        event.messageID
      );
    }
  } else {
    code = contentInput;
  }

  // ✅ Validate JS syntax
  try {
    new vm.Script(code);
  } catch (err) {
    return api.sendMessage(
      `❌ কোড সিনট্যাক্স ভুল:\n${err.message}`,
      event.threadID,
      event.messageID
    );
  }

  // ✅ Write file
  const filePath = path.join(__dirname, fileName);

  if (fs.existsSync(filePath)) {
    return api.sendMessage(
      `⚠️ ${fileName} ফাইলটি ইতিমধ্যে বিদ্যমান!`,
      event.threadID,
      event.messageID
    );
  }

  try {
    fs.writeFileSync(filePath, code, "utf-8");
    api.sendMessage(
      `✅ সফলভাবে ফাইল তৈরি হয়েছে:\n📁 ${filePath}`,
      event.threadID,
      event.messageID
    );
  } catch (err) {
    console.error("File write error:", err);
    api.sendMessage(
      `❌ ফাইল তৈরি করতে ব্যর্থ:\n${err.message}`,
      event.threadID,
      event.messageID
    );
  }
};
