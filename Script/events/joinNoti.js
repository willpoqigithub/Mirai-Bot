module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "MIRAI-BOT",
  description: "Notification of bots or people entering groups without media"
};

module.exports.onLoad = () => {};

module.exports.run = async function({ api, event }) {
  const { threadID } = event;

  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    await api.changeNickname(`[ ${global.config.PREFIX} ] • ${global.config.BOTNAME || "MIRAI-BOT-LOVER"}`, threadID, api.getCurrentUserID());
    return api.sendMessage(
      `╭╭•┄┅═══❁🌺❁═══┅┄•╮\n🖤 Welcome! 🖤\n╰•┄┅═══❁🌺❁═══┅┄•╯\n\n┏━━━━━━━━━━━━━━━━━┓\n┃ 🤗 Thank you so much ┃\n┃ for adding me to your ┃\n┃ 🫶 group family! ┃\n┗━━━━━━━━━━━━━━━━━┛\n\n📿 *I'll always be here to serve you.*\n🌸 *Good behavior will get you better service.*\n\n╭─🎯 USEFUL COMMANDS ─╮\n│ ℹ️ ${global.config.PREFIX}info – Bot information \n│ 💬 ${global.config.PREFIX}jan – Chat with smart AI \n│ ⏱️ ${global.config.PREFIX}uptime – Check bot uptime \n╰────────────────────────╯\n\n🔧 BOT NAME : *MIRAI-BOT*\n🧑‍💻 DEVELOPED BY : *Willy Magusib*\n\n⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆`,
      threadID
    );
  } else {
    try {
      const { threadName, participantIDs } = await api.getThreadInfo(threadID);
      const threadData = global.data.threadData.get(parseInt(threadID)) || {};
      const nameArray = [];
      const mentions = [];
      let i = 0;
      for (const p of event.logMessageData.addedParticipants) {
        nameArray.push(p.fullName);
        mentions.push({ tag: p.fullName, id: p.userFbId });
        i++;
      }
      const memberCount = participantIDs.length;
      let msg = threadData.customJoin || `╭•┄┅═══❁🌺❁═══┅┄•╮\n Welcome! 🖤\n╰•┄┅═══❁🌺❁═══┅┄•╯ \n\n✨ WELL COME ✨\n\n❥ NEW MEMBER : {name}\n\n🌸 Welcome to our group –\n{threadName} –!\n\nYou are now our {soThanhVien} member 🥰\n\n╭•┄┅═══❁🌺❁═══┅┄•╮\n 🌸 MIRAI-BOT 🌸\n╰•┄┅═══❁🌺❁═══┅┄•╯`;
      msg = msg
        .replace(/\{name}/g, nameArray.join(', '))
        .replace(/\{soThanhVien}/g, memberCount)
        .replace(/\{threadName}/g, threadName);
      return api.sendMessage({ body: msg, mentions }, threadID);
    } catch (e) {
      console.error("JoinNoti Error:", e);
    }
  }
};
