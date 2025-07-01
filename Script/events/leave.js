const moment = require("moment-timezone");

module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "2.0.0",
  credits: "Decorated by Aminul Sordar based on MIRAI-BOT",
  description: "Send a decorated goodbye message when someone leaves the group.",
  dependencies: {}
};

module.exports.onLoad = () => {
  // No need for any folders — media removed
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  // If the bot leaves, skip the message
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const { threadID } = event;

  // Get current time and session
  const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
  const hour = parseInt(moment.tz("Asia/Dhaka").format("HH"));
  const session =
    hour < 10 ? "🌅 Morning" :
    hour <= 12 ? "🌤️ Noon" :
    hour <= 18 ? "🌇 Afternoon" :
    "🌙 Evening";

  // Get group data and user info
  const threadData = global.data.threadData.get(threadID) || (await Threads.getData(threadID)).data;
  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
  const type = (event.author == event.logMessageData.leftParticipantFbId) ? "left on their own" : "was removed";

  // Default decorated message
  let msg = typeof threadData.customLeave === "undefined"
    ? `╭───────────────╮\n` +
      ` 🙋‍♂️ Member Left Notice\n` +
      `╰───────────────╯\n\n` +
      `👤 Name: ✨ ${name} ✨\n` +
      `📤 Status: ${type}\n` +
      `🕒 Time: ${time}\n` +
      `📆 Session: ${session}\n\n` +
      `💌 We hope you'll always remember the good times here.\n` +
      `🔕 Don't follow their path if they did wrong.\n\n` +
      `🕌 Stay united in this Islamic group 💙`
    : threadData.customLeave;

  // Replace placeholders in customLeave message
  msg = msg
    .replace(/\{name}/g, name)
    .replace(/\{type}/g, type)
    .replace(/\{time}/g, time)
    .replace(/\{session}/g, session);

  return api.sendMessage({ body: msg }, threadID);
};
