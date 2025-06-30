const moment = require('moment-timezone');

module.exports.config = {
  name: "prefix",
  version: "1.0.1",
  hasPermission: 2,
  credits: "𝐈𝐬𝐥𝐚𝐦𝐢𝐜𝐤 𝐂𝐲𝐛𝐞𝐫",
  description: "Responds when someone sends 'prefix'",
  commandCategory: "bot prefix",
  usages: "prefix",
  cooldowns: 5,
};

module.exports.languages = {
  en: {
    title: "🤍✨ ROBOT PREFIX ✨🤍",
    botName: "BOT NAME",
    prefix: "ROBOT PREFIX",
    cmdCount: "ROBOT CMD",
    time: "TIME",
    group: "GROUP NAME"
  },
  vi: {
    title: "🤍✨ TIỀN TỐ ROBOT ✨🤍",
    botName: "TÊN BOT",
    prefix: "TIỀN TỐ",
    cmdCount: "LỆNH ĐÃ TẢI",
    time: "THỜI GIAN",
    group: "TÊN NHÓM"
  }
};

module.exports.handleEvent = async ({ api, event, getText }) => {
  const body = event.body ? event.body.toLowerCase() : '';
  if (body.startsWith("prefix")) {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const groupName = threadInfo.threadName || "This Group";
    const time = moment.tz("Asia/Dhaka").format("LLLL");

    const text = `╭•┄┅═══❁🌺❁═══┅┄•╮\n${getText("title")}\n╰•┄┅═══❁🌺❁═══┅┄•╯\n\n${getText("botName")} : ${global.config.BOTNAME}\n${getText("prefix")} : ｢ ${global.config.PREFIX} ｣\n${getText("cmdCount")}: ｢ ${client.commands.size} ｣\n${getText("time")}: ${time}\n${getText("group")}: ${groupName}`;

    api.sendMessage({ body: text }, event.threadID, event.messageID);
  }
};

module.exports.run = () => {}; // No manual run needed
