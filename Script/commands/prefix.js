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

module.exports.handleEvent = async ({ api, event }) => {
  const body = event.body ? event.body.toLowerCase() : '';
  if (body.startsWith("prefix")) {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const groupName = threadInfo.threadName || "This Group";
    const time = moment.tz("Asia/Dhaka").format("LLLL");

    const text = `╭•┄┅═══❁🌺❁═══┅┄•╮\n🤍✨𝐑𝐎𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗✨🤍\n╰•┄┅═══❁🌺❁═══┅┄•╯\n\n𝐁𝐎𝐓 𝐍𝐀𝐌𝐄 : ${global.config.BOTNAME}\n𝐑𝐎𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗 : ｢ ${global.config.PREFIX} ｣\n𝐑𝐎𝐁𝐎𝐓 𝐂𝐌𝐃: ｢ ${client.commands.size} ｣\n𝐓𝐈𝐌𝐄 : ${time}\n𝐆𝐑𝐎𝐔𝐏 𝐍𝐀𝐌𝐄: ${groupName}\n`;

    api.sendMessage({ body: text }, event.threadID, event.messageID);
  }
};

module.exports.run = () => {}; // No command usage needed since always on
