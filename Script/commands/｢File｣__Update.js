module.exports.config = {
  name: "update",	
  version: "2.0.0", 
  hasPermssion: 0,
  credits: "Islamick Cyber Chat",
  description: "sos", 
  commandCategory: "No need for command marks",
  usages: "¹",
  cooldowns: 0
};
module.exports.languages = {
  "vi": {},
  "en": {}
};

function random(arr) {
var rd = arr[Math.floor(Math.random() * arr.length)];
    return rd;
        };
module.exports.handleEvent = async function ({ api, event, Threads }) {
  const tim = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
var thu = moment.tz('Asia/Dhaka').format('dddd');
  if (thu == 'Sunday') thu = '𝐒𝐔𝐍𝐃𝐀𝐘'
  if (thu == 'Monday') thu = '𝐌𝐎𝐍𝐃𝐀𝐘'
  if (thu == 'Tuesday') thu = '𝐓𝐔𝐄𝐒𝐃𝐀𝐘'
  if (thu == 'Wednesday') thu = '𝐖𝐄𝐃𝐍𝐄𝐒𝐃𝐀𝐘'
  if (thu == "Thursday") thu = '𝐓𝐇𝐔𝐑𝐒𝐃𝐀𝐘'
  if (thu == 'Friday') thu = '𝐅𝐑𝐈𝐃𝐀𝐘'
  if (thu == 'Saturday') thu = '𝐒𝐀𝐓𝐔𝐑𝐃𝐀𝐘'
  const request = require('request');
  const picture = (await axios.get(`https://i.imgur.com/7SZdBRT.jpeg`, { responseType: "stream"})).data
  var { threadID, messageID, body } = event,{ PREFIX } = global.config;
  let threadSetting = global.data.threadData.get(threadID) || {};
  let prefix = threadSetting.PREFIX || PREFIX;
  const icon = [""];
  if (body.toLowerCase() == "random") {
       api.sendMessage({body: `•—»✨𝐑𝐀𝐍𝐃𝐎𝐍 𝐕𝐈𝐃𝐄𝐎✨«—•\n•┄┅════❁🌺❁════┅┄•\n 𝐍𝐎𝐖: ${tim} || ${thu}  `, attachment: (await axios.get((await axios.get(`https://vip-img-api.onrender.com/ai`)).data.url, {
                    responseType: 'stream'
                })).data}, event.threadID, event.messageID);	
  }
      if (body.toLowerCase() == "random") {
       api.sendMessage({body: `•—»✨𝐑𝐀𝐍𝐃𝐎𝐍 𝐕𝐈𝐃𝐄𝐎✨«—•\n•┄┅════❁🌺❁════┅┄•\n𝐍𝐎𝐖: ${tim} || ${thu}`, attachment: (await axios.get((await axios.get(`https://rajib-api-1.islam500.repl.co/vdlq`)).data.url, {
                    responseType: 'stream'
                })).data}, event.threadID, event.messageID);	
      }
if (body.toLowerCase() == "random") {
       api.sendMessage({body: `•—»✨𝐑𝐀𝐍𝐃𝐎𝐍 𝐕𝐈𝐃𝐄𝐎✨«—•\n•┄┅════❁🌺❁════┅┄•\n𝐍𝐎𝐖: ${tim} || ${thu}  `, attachment: (await axios.get((await axios.get(`https://vip-img-api.onrender.com/vdremix`)).data.url, {
                    responseType: 'stream'
                })).data}, event.threadID, event.messageID);	
}
if (body.toLowerCase() == "random") {
       api.sendMessage({body: `•—»✨𝐑𝐀𝐍𝐃𝐎𝐍 𝐕𝐈𝐃𝐄𝐎✨«—•\n•┄┅════❁🌺❁════┅┄•\n𝐍𝐎𝐖: ${tim} || ${thu}  `, attachment: (await axios.get((await axios.get(`https://vip-img-api.onrender.com/vdvip`)).data.url, {
                    responseType: 'stream'
                })).data}, event.threadID, event.messageID);	
}
 }
//no api then attachment: (picture)}, event.threadID, event.messageID);
module.exports.handleReaction = async function({ api, event, Threads, handleReaction, getText }) {
  try {
    if (event.userID != handleReaction.author) return;
    const { threadID, messageID } = event;
    var data = (await Threads.getData(String(threadID))).data || {};
    data["PREFIX"] = handleReaction.PREFIX;
    await Threads.setData(threadID, { data });
    await global.data.threadData.set(String(threadID), data);
    api.unsendMessage(handleReaction.messageID);
    return api.sendMessage(`changed the group prefix to: ${handleReaction.PREFIX}`, threadID, messageID);
  } catch (e) { return console.log(e) }
}

module.exports.run = async ({ api, event, args, Threads }) => {
  if (typeof args[0] == "undefined") return api.sendMessage("You must enter the prefix that needs to be changed", event.threadID, event.messageID);
  let prefix = args[0].trim();
  if (!prefix) return api.sendMessage("You must enter the prefix that needs to be changed", event.threadID, event.messageID);
  if (prefix == "reset") {
    var data = (await Threads.getData(event.threadID)).data || {};
    data["PREFIX"] = global.config.PREFIX;
    await Threads.setData(event.threadID, { data });
    await global.data.threadData.set(String(event.threadID), data);
    return api.sendMessage(`reset prefix to: ${global.config.PREFIX}`, event.threadID, event.messageID);
  } else return api.sendMessage(`Are you sure you want to change the group's prefix to: ${prefix}\n👉 drop your reaction on this message to confirm`, event.threadID, (error, info) => {
    global.client.handleReaction.push({
      name: this.config.name,
      messageID: info.messageID,
      author: event.senderID,
      PREFIX: prefix
    })
  })
                          }
