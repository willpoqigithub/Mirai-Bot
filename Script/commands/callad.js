const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const moment = require('moment-timezone');

module.exports.config = {
  name: "callad",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "AMINULSORDAR",
  description: "Report bug of your bot to admin or comment",
  commandCategory: "Admin",
  usages: "[msg]",
  cooldowns: 5,
};

module.exports.languages = {
  en: {
    noReportContent: "❌ You haven't entered what to report 📋",
    successSend: (count) => `✅ Bot has successfully sent your message to ${count} admin(s) 🍄`,
    reportFrom: (name, uid, threadName, threadID, inbox, time) =>
      `📱 [ CALL ADMIN ] 📱\n\n👤 Report from: ${name}\n🆔 User ID: ${uid}\n📂 Box: ${threadName}\n🆔 Box ID: ${threadID}\n\n💌 Inbox: ${inbox}\n⏰ Time: ${time}`,
    feedbackFromAdmin: (name) =>
      `📌 Feedback from admin ${name} to you:\n\n💬 Content below\n\n» Reply to continue sending reports.`,
    noReply: "no reply 🌸",
    onlyFilesNoReply: "only files with no reply 🌸",
  },
  ar: {
    noReportContent: "❌ لم تدخل ما تريد الإبلاغ عنه 📋",
    successSend: (count) => `✅ تم إرسال رسالتك إلى ${count} مسؤول(ين) بنجاح 🍄`,
    reportFrom: (name, uid, threadName, threadID, inbox, time) =>
      `📱 [ اتصال بالمسؤول ] 📱\n\n👤 تقرير من: ${name}\n🆔 معرف المستخدم: ${uid}\n📂 الصندوق: ${threadName}\n🆔 معرف الصندوق: ${threadID}\n\n💌 المحتوى: ${inbox}\n⏰ الوقت: ${time}`,
    feedbackFromAdmin: (name) =>
      `📌 ملاحظات من المسؤول ${name} إليك:\n\n💬 المحتوى أدناه\n\n» رد على هذه الرسالة إذا أردت متابعة الإبلاغ.`,
    noReply: "لا رد 🌸",
    onlyFilesNoReply: "ملفات فقط بدون رد 🌸",
  },
  vi: {
    noReportContent: "❌ Bạn chưa nhập nội dung báo cáo 📋",
    successSend: (count) => `✅ Bot vừa gửi thành công tin nhắn của bạn tới ${count} quản trị viên 🍄`,
    reportFrom: (name, uid, threadName, threadID, inbox, time) =>
      `📱 [ GỌI ADMIN ] 📱\n\n👤 Báo cáo từ: ${name}\n🆔 ID người dùng: ${uid}\n📂 Hộp: ${threadName}\n🆔 ID hộp: ${threadID}\n\n💌 Nội dung: ${inbox}\n⏰ Thời gian: ${time}`,
    feedbackFromAdmin: (name) =>
      `📌 Phản hồi từ admin ${name} tới bạn:\n\n💬 Nội dung bên dưới\n\n» Reply tin nhắn này nếu bạn muốn tiếp tục gửi báo cáo.`,
    noReply: "không trả lời 🌸",
    onlyFilesNoReply: "chỉ có file không có trả lời 🌸",
  },
  koro: {
    noReportContent: "❌ 보고할 내용을 입력하지 않으셨습니다 📋",
    successSend: (count) => `✅ 메시지가 ${count}명의 관리자에게 성공적으로 전송되었습니다 🍄`,
    reportFrom: (name, uid, threadName, threadID, inbox, time) =>
      `📱 [ 관리자에게 신고 ] 📱\n\n👤 신고자: ${name}\n🆔 사용자 ID: ${uid}\n📂 채팅방: ${threadName}\n🆔 채팅방 ID: ${threadID}\n\n💌 내용: ${inbox}\n⏰ 시간: ${time}`,
    feedbackFromAdmin: (name) =>
      `📌 관리자 ${name}의 피드백:\n\n💬 아래 내용\n\n» 계속해서 신고를 보내려면 이 메시지에 답장하세요.`,
    noReply: "답변 없음 🌸",
    onlyFilesNoReply: "답변 없는 파일만 🌸",
  }
};

async function downloadAttachments(attachments) {
  if (!attachments || attachments.length === 0) return { paths: [], streams: [] };

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charLength = 20;
  const paths = [];
  const streams = [];

  for (const file of attachments) {
    let ext = 'jpg'; // default
    if (file.type === 'photo') ext = 'jpg';
    else if (file.type === 'video') ext = 'mp4';
    else if (file.type === 'audio') ext = 'mp3';
    else if (file.type === 'animated_image') ext = 'gif';

    let filename = '';
    for (let i = 0; i < charLength; i++) {
      filename += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const filepath = path.join(__dirname, 'cache', `${filename}.${ext}`);

    try {
      const response = await axios.get(encodeURI(file.url), { responseType: 'arraybuffer' });
      await fs.writeFile(filepath, Buffer.from(response.data));
      paths.push(filepath);
      streams.push(fs.createReadStream(filepath));
    } catch (error) {
      console.error(`Failed to download file: ${file.url}`, error);
    }
  }

  return { paths, streams };
}

async function cleanupFiles(paths) {
  for (const filePath of paths) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn(`Failed to delete file ${filePath}:`, error);
    }
  }
}

module.exports.handleReply = async function({ api, event, handleReply, Users }) {
  try {
    const userData = await Users.getData(event.senderID);
    const userName = userData.name || "Unknown";
    const lang = userData.language || 'en';

    const { paths, streams } = await downloadAttachments(event.attachments);

    switch (handleReply.type) {
      case "reply": {
        const admins = global.config.ADMINBOT || [];
        if (paths.length === 0) {
          for (const adminID of admins) {
            api.sendMessage({
              body: `📲 Feedback from ${userName}:\n💬 Content: ${event.body || "No content"}`,
              mentions: [{ id: event.senderID, tag: userName }]
            }, adminID, (err, info) => {
              if (!err) {
                global.client.handleReply.push({
                  name: this.config.name,
                  messageID: info.messageID,
                  messID: event.messageID,
                  author: event.senderID,
                  id: event.threadID,
                  type: "calladmin"
                });
              }
            });
          }
        } else {
          for (const adminID of admins) {
            api.sendMessage({
              body: `📲 Feedback from ${userName}:\n${event.body || this.languages[lang].onlyFilesNoReply}`,
              attachment: streams,
              mentions: [{ id: event.senderID, tag: userName }]
            }, adminID, (err, info) => {
              if (!err) {
                global.client.handleReply.push({
                  name: this.config.name,
                  messageID: info.messageID,
                  messID: event.messageID,
                  author: event.senderID,
                  id: event.threadID,
                  type: "calladmin"
                });
              }
            });
          }
          await cleanupFiles(paths);
        }
        break;
      }
      case "calladmin": {
        if (paths.length === 0) {
          api.sendMessage({
            body: `📌 Feedback from admin ${userName} to you:\n\n💬 Content: ${event.body || this.languages[lang].noReply}\n\n» Reply to continue sending reports.`,
            mentions: [{ tag: userName, id: event.senderID }]
          }, handleReply.id, (err, info) => {
            if (!err) {
              global.client.handleReply.push({
                name: this.config.name,
                author: event.senderID,
                messageID: info.messageID,
                type: "reply"
              });
            }
          }, handleReply.messID);
        } else {
          api.sendMessage({
            body: `📌 Feedback from admin ${userName} to you:\n\n💬 Content: ${event.body || this.languages[lang].onlyFilesNoReply}\n📩 Admin files sent to you\n\n» Reply to continue sending reports.`,
            attachment: streams,
            mentions: [{ tag: userName, id: event.senderID }]
          }, handleReply.id, (err, info) => {
            if (!err) {
              global.client.handleReply.push({
                name: this.config.name,
                author: event.senderID,
                messageID: info.messageID,
                type: "reply"
              });
            }
          }, handleReply.messID);
          await cleanupFiles(paths);
        }
        break;
      }
    }
  } catch (ex) {
    console.error("Error in handleReply:", ex);
  }
};

module.exports.run = async function({ api, event, Threads, args, Users }) {
  try {
    const userData = await Users.getData(event.senderID);
    const userName = userData.name || "Unknown";
    const lang = userData.language || 'en';

    let attachments = [];
    if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
      attachments = event.messageReply.attachments;
    }

    if ((!args[0] || args.length === 0) && attachments.length === 0) {
      return api.sendMessage(this.languages[lang].noReportContent, event.threadID, event.messageID);
    }

    const { paths, streams } = await downloadAttachments(attachments);

    const threadData = await Threads.getData(event.threadID);
    const threadInfo = threadData.threadInfo || {};
    const threadName = threadInfo.threadName || "Unknown Thread";

    const userID = event.senderID;
    const threadID = event.threadID;
    const timeNow = moment.tz("Asia/Manila").format("HH:mm:ss D/MM/YYYY");
    const adminCount = (global.config.ADMINBOT || []).length;

    // Notify user about sending
    api.sendMessage(this.languages[lang].successSend(adminCount) + `\n[⏰] Time: ${timeNow}`, event.threadID);

    const admins = global.config.ADMINBOT || [];
    if (paths.length === 0) {
      for (const adminID of admins) {
        const msgBody = this.languages[lang].reportFrom(userName, userID, threadName, threadID, args.join(" "), timeNow);
        api.sendMessage({
          body: msgBody,
          mentions: [{ id: event.senderID, tag: userName }]
        }, adminID, (err, info) => {
          if (!err) {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              messID: event.messageID,
              id: threadID,
              type: "calladmin"
            });
          }
        });
      }
    } else {
      for (const adminID of admins) {
        const msgBody = this.languages[lang].reportFrom(userName, userID, threadName, threadID, args.join(" ") || this.languages[lang].onlyFilesNoReply, timeNow);
        api.sendMessage({
          body: msgBody,
          attachment: streams,
          mentions: [{ id: event.senderID, tag: userName }]
        }, adminID, (err, info) => {
          if (!err) {
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              author: event.senderID,
              messID: event.messageID,
              id: threadID,
              type: "calladmin"
            });
          }
        });
      }
      await cleanupFiles(paths);
    }
  } catch (ex) {
    console.error("Error in callad run:", ex);
  }
};
