module.exports.config = {
  name: "adminUpdate",
  eventType: ["log:thread-admins", "log:thread-name", "log:user-nickname"],
  version: "1.0.1",
  credits: "Mirai Team",
  description: "Quickly update group information",
  envConfig: {
    autoUnsend: true,
    sendNoti: true,
    timeToUnsend: 10
  }
};

module.exports.run = async function ({ event, api, Threads }) {
  const { threadID, logMessageType, logMessageData } = event;
  const { setData, getData } = Threads;
  try {
    let dataThread = (await getData(threadID)).threadInfo;
    switch (logMessageType) {
      case "log:thread-admins": {
        if (logMessageData.ADMIN_EVENT == "add_admin") {
          dataThread.adminIDs.push({ id: logMessageData.TARGET_ID })
          if (global.configModule[this.config.name].sendNoti) api.sendMessage(`[ Group Update ] New admin added! ${logMessageData.TARGET_ID} is now an admin`, threadID, async (error, info) => {
            if (global.configModule[this.config.name].autoUnsend) {
              await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
              return api.unsendMessage(info.messageID);
            } else return;
          });
        } else if (logMessageData.ADMIN_EVENT == "remove_admin") {
          dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id != logMessageData.TARGET_ID);
          if (global.configModule[this.config.name].sendNoti) api.sendMessage(`[ Group Update ] ${logMessageData.TARGET_ID} has been removed as admin`, threadID, async (error, info) => {
            if (global.configModule[this.config.name].autoUnsend) {
              await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
              return api.unsendMessage(info.messageID);
            } else return;
          });
        }
        break;
      }
      case "log:user-nickname": {
        dataThread.nicknames[logMessageData.participant_id] = logMessageData.nickname;
        if (typeof global.configModule["nickname"] != "undefined" && !global.configModule["nickname"].allowChange.includes(threadID) && !dataThread.adminIDs.some(item => item.id == event.author) || event.author == api.getCurrentUserID()) return;
        if (global.configModule[this.config.name].sendNoti) api.sendMessage(`[ Group Update ] ${logMessageData.participant_id} changed their nickname to ${(logMessageData.nickname.length == 0) ? "original name" : logMessageData.nickname}`, threadID, async (error, info) => {
          if (global.configModule[this.config.name].autoUnsend) {
            await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
            return api.unsendMessage(info.messageID);
          } else return;
        });
        break;
      }
      case "log:thread-name": {
        dataThread.threadName = event.logMessageData.name || "No name";
        if (global.configModule[this.config.name].sendNoti) api.sendMessage(`[ Group Update ] Group name updated to ${dataThread.threadName}`, threadID, async (error, info) => {
          if (global.configModule[this.config.name].autoUnsend) {
            await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
            return api.unsendMessage(info.messageID);
          } else return;
        });
        break;
      }
    }
    await setData(threadID, { threadInfo: dataThread });
  } catch (e) {
    console.log(e)
  };
}
