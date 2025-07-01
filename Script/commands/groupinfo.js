const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "groupinfo",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Mirai Team + Modified by Aminul Sordar",
  description: "View your group (box) information",
  commandCategory: "Box",
  usages: "groupinfo",
  cooldowns: 0
};

module.exports.languages = {
  en: {
    info: `
🔧 GC Name: %1
🔧 Group ID: %2
🔧 Approval: %3
🔧 Emoji: %4
🔧 Members: %5
🔧 Males: %6
🔧 Females: %7
🔧 Admins: %8
🔧 Total Messages: %9
Made with ❤️ by: AMINUL-SORDAR`
  },
  vi: {
    info: `
🔧 Tên nhóm: %1
🔧 ID nhóm: %2
🔧 Phê duyệt: %3
🔧 Biểu cảm: %4
🔧 Thành viên: %5
🔧 Nam: %6
🔧 Nữ: %7
🔧 Quản trị viên: %8
🔧 Tổng tin nhắn: %9
Tạo bởi ❤️: AMINUL-SORDAR`
  }
};

module.exports.run = async function ({ api, event, args, getText }) {
  const threadInfo = await api.getThreadInfo(event.threadID);
  const memLength = threadInfo.participantIDs.length;

  let genderMale = 0, genderFemale = 0;

  for (const user of threadInfo.userInfo) {
    if (user.gender === "MALE") genderMale++;
    else if (user.gender === "FEMALE") genderFemale++;
  }

  const approval = threadInfo.approvalMode ? "Turned on" : "Turned off";
  const threadName = threadInfo.threadName || "No name";
  const emoji = threadInfo.emoji || "❔";
  const groupID = threadInfo.threadID;
  const totalMsg = threadInfo.messageCount;
  const adminCount = threadInfo.adminIDs.length;

  const messageText = getText("info", threadName, groupID, approval, emoji, memLength, genderMale, genderFemale, adminCount, totalMsg);

  const callback = () => {
    api.sendMessage({
      body: messageText,
      attachment: fs.existsSync(__dirname + '/cache/groupinfo.png') ? fs.createReadStream(__dirname + '/cache/groupinfo.png') : undefined
    }, event.threadID, () => {
      if (fs.existsSync(__dirname + '/cache/groupinfo.png')) {
        fs.unlinkSync(__dirname + '/cache/groupinfo.png');
      }
    }, event.messageID);
  };

  if (threadInfo.imageSrc) {
    request(encodeURI(threadInfo.imageSrc))
      .pipe(fs.createWriteStream(__dirname + '/cache/groupinfo.png'))
      .on('close', () => callback());
  } else {
    callback();
  }
};
