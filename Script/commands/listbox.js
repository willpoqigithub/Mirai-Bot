module.exports.config = {
  name: 'listbox',
  version: '1.0.0',
  credits: 'Mirai Team',
  hasPermssion: 2,
  description: 'List threads the bot has joined',
  commandCategory: 'System',
  usages: 'listbox',
  cooldowns: 15
};

module.exports.handleReply = async function({ api, event, Threads, handleReply }) {
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;

  const args = event.body.trim().split(/\s+/);
  const action = args[0].toLowerCase();
  const index = parseInt(args[1]);

  if (isNaN(index) || index < 1 || index > handleReply.groupid.length)
    return api.sendMessage('❌ Invalid number.', event.threadID, event.messageID);

  const threadID = handleReply.groupid[index - 1];

  switch (handleReply.type) {
    case 'reply': {
      if (action === 'ban') {
        const threadData = (await Threads.getData(threadID)).data || {};
        threadData.banned = 1;
        await Threads.setData(threadID, { data: threadData });
        global.data.threadBanned.set(parseInt(threadID), 1);
        return api.sendMessage(`✅ Thread [${threadID}] has been banned!`, event.threadID, event.messageID);
      }

      if (action === 'out') {
        try {
          await api.removeUserFromGroup(api.getCurrentUserID(), threadID);
          const { name } = await Threads.getData(threadID);
          return api.sendMessage(`✅ Removed from thread: ${name || 'Unknown'}\n🧩 TID: ${threadID}`, event.threadID, event.messageID);
        } catch (err) {
          return api.sendMessage(`❌ Failed to leave thread [${threadID}]: ${err.message}`, event.threadID, event.messageID);
        }
      }

      return api.sendMessage('❌ Unknown action. Use "ban" or "out".', event.threadID, event.messageID);
    }
  }
};

module.exports.run = async function({ api, event, Threads }) {
  const inbox = await api.getThreadList(100, null, ['INBOX']);
  const groups = inbox.filter(thread => thread.isSubscribed && thread.isGroup);
  const resultList = [];

  for (const thread of groups) {
    const threadInfo = await api.getThreadInfo(thread.threadID);
    resultList.push({
      id: thread.threadID,
      name: thread.name || 'Unnamed Group',
      memberCount: threadInfo.userInfo.length
    });
  }

  resultList.sort((a, b) => b.memberCount - a.memberCount);

  let msg = '📦 List of groups the bot is in:\n\n';
  const groupid = [];

  resultList.forEach((group, index) => {
    msg += `${index + 1}. ${group.name}\n🧩 TID: ${group.id}\n👥 Members: ${group.memberCount}\n\n`;
    groupid.push(group.id);
  });

  msg += '💬 Reply with:\n👉 "out <number>" to leave\n👉 "ban <number>" to ban the group';

  api.sendMessage(msg, event.threadID, (err, info) => {
    if (err) return;
    global.client.handleReply.push({
      name: module.exports.config.name,
      author: event.senderID,
      messageID: info.messageID,
      groupid,
      type: 'reply'
    });
  });
};

module.exports.languages = {
  en: {
    // Add English responses if needed
  },
  vi: {
    // Add Vietnamese responses if needed
  },
  bn: {
    // Optional: Add Bengali if you're supporting it
  }
};
