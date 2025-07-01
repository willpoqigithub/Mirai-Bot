module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "MIRAI-BOT",
  description: "Notification of bots or people entering groups without media"
};

module.exports.onLoad = () => {}; // GIF/Video cache আর দরকার নাই

module.exports.run = async function({ api, event }) {
  const { threadID } = event;

  // যদি বটকে কেউ গ্রুপে অ্যাড করে
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    await api.changeNickname(`[ ${global.config.PREFIX} ] • ${global.config.BOTNAME || "BOT"}`, threadID, api.getCurrentUserID());
    return api.sendMessage(
      `╭╭•┄┅═══❁🌺❁═══┅┄•╮\n🖤 আসসালামু আলাইকুম 🖤\n╰•┄┅═══❁🌺❁═══┅┄•╯\n\n┏━━━━━━━━━━━━━━━━━┓\n┃ 🤗 𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡┃\n┃ 𝐟𝐨𝐫 𝐚𝐝𝐝𝐢𝐧𝐠 𝐦𝐞 𝐭𝐨 𝐲𝐨𝐮𝐫 ┃\n┃ 🫶 𝐠𝐫𝐨𝐮𝐩 𝐟𝐚𝐦𝐢𝐥𝐲!     ┃\n┗━━━━━━━━━━━━━━━━━┛\n\n📿 *ইনশাআল্লাহ আমি সবসময় আপনাদের সেবা করব।*\n🌸 *ভালো ব্যবহারে আরও ভালো সার্ভিস পাবেন।*\n\n╭─🎯 𝐔𝐒𝐄𝐅𝐔𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 ─╮\n│ ℹ️ ${global.config.PREFIX}info – বট সম্পর্কিত তথ্য  \n│ 💬 ${global.config.PREFIX}jan – স্মার্ট AI এর সাথে চ্যাট করুন  \n│ ⏱️ ${global.config.PREFIX}uptime – বট চালু থাকার সময় দেখুন  \n╰────────────────────────╯\n\n🔧 𝐁𝐎𝐓 𝐍𝐀𝐌𝐄 : *MIRAI-BOT*\n🧑‍💻 𝐃𝐄𝐕𝐄𝐋𝐎𝐏𝐄𝐃 𝐁𝐘 : *Aminul Sordar*\n\n⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆`, 
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
      let msg = threadData.customJoin || 
`╭•┄┅═══❁🌺❁═══┅┄•╮\n   আসসালামু আলাইকুম-!!🖤\n╰•┄┅═══❁🌺❁═══┅┄•╯ \n\n✨🆆🅴🅻🅻 🅲🅾🅼🅴 ✨\n\n❥ 𝐍𝐄𝐖~ 𝐌𝐄𝐌𝐁𝐄𝐑 : {name}\n\n🌸 আপনাকে আমাদের গ্রুপ –\n{threadName} – এ স্বাগতম!\n\nআপনি এখন আমাদের {soThanhVien} নং সদস্য 🥰\n\n╭•┄┅═══❁🌺❁═══┅┄•╮\n     🌸  MIRAI-BOT  🌸\n╰•┄┅═══❁🌺❁═══┅┄•╯`;

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
