module.exports.config = {
  name: "bio",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Mirai Team",
  description: "Change bot's bio",
  commandCategory: "admin",
  usages: "bio [text]",
  cooldowns: 5
};

module.exports.languages = {
  en: {
    success: "✅ Bot bio updated to:\n",
    error: "❌ An error occurred while changing bio:\n"
  },
  vi: {
    success: "✅ Đã cập nhật tiểu sử bot thành:\n",
    error: "❌ Đã xảy ra lỗi khi thay đổi tiểu sử:\n"
  }
};

module.exports.run = async ({ api, event, args, getText }) => {
  const newBio = args.join(" ");
  if (!newBio) return api.sendMessage("⚠️ Please provide a new bio text.", event.threadID, event.messageID);

  api.changeBio(newBio, (err) => {
    if (err)
      return api.sendMessage(getText("error") + err, event.threadID, event.messageID);
    return api.sendMessage(getText("success") + newBio, event.threadID, event.messageID);
  });
};
