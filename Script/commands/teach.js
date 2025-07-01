const axios = require("axios");
const chalk = require("chalk");

module.exports.config = {
  name: "teach",
  version: "1.2.0",
  hasPermssion: 0, // Admin/mod only
  credits: "Aminul Sordar",
  description: "Jan API কে শেখাও এবং জ্ঞানভাণ্ডার পরিমাপ করো",
  commandCategory: "admin",
  usages:
    "/teach প্রশ্ন - উত্তর | প্রশ্ন2 - উত্তর2 | ...\n" +
    "/count - মোট প্রশ্ন ও উত্তর দেখাও",
  cooldowns: 5,
};

module.exports.languages = {
  en: {
    teach_no_input: "❌ Please provide questions and answers with the /teach command.",
    teach_wrong_format:
      "❌ Please use the correct format:\n/teach question - answer\n\nSeparate multiple questions by '|'.",
    teach_success: "✅ Teaching completed:\n\n%s",
    count_info:
      "📊 Knowledge Base:\n\n📌 Total questions: %1$d\n📌 Total answers: %2$d\n\n💡 Make me smarter by teaching more!\n🔍 Ask me questions, I'll try to answer!",
    unknown_command: "❌ Unknown command! Use /teach or /count.",
    teach_fail: "❌ Teaching failed! Server problem may exist.",
  },
  vi: {
    teach_no_input: "❌ Vui lòng cung cấp câu hỏi và câu trả lời với lệnh /teach.",
    teach_wrong_format:
      "❌ Vui lòng sử dụng đúng định dạng:\n/teach câu hỏi - câu trả lời\n\nPhân cách nhiều câu hỏi bằng '|'.",
    teach_success: "✅ Đã hoàn thành việc dạy:\n\n%s",
    count_info:
      "📊 Kho tri thức:\n\n📌 Tổng số câu hỏi: %1$d\n📌 Tổng số câu trả lời: %2$d\n\n💡 Hãy dạy tôi nhiều hơn để tôi thông minh hơn!\n🔍 Hỏi tôi một vài câu hỏi, tôi sẽ cố gắng trả lời!",
    unknown_command: "❌ Lệnh không hợp lệ! Vui lòng sử dụng /teach hoặc /count.",
    teach_fail: "❌ Dạy thất bại! Có thể do vấn đề máy chủ.",
  },
};

function formatString(str, ...args) {
  // Simple placeholder formatter: %s or %1$d, %2$d etc.
  let formatted = str;
  args.forEach((arg, i) => {
    const reg = new RegExp(`%(${i + 1}\\$)?[sd]`, "g");
    formatted = formatted.replace(reg, arg);
  });
  return formatted;
}

async function teachMultiple(qaText) {
  try {
    console.log(chalk.blue("[TEACH] Sending teaching data to server..."));
    const res = await axios.post(
      `https://jan-api-by-aminul-sordar.vercel.app/teach`,
      { text: qaText }
    );
    console.log(chalk.green("[TEACH] Server response:"), res.data.message);
    return res.data.message;
  } catch (e) {
    console.error(chalk.red("[TEACH] teachMultiple error:"), e.message);
    return null;
  }
}

async function fetchCount() {
  try {
    console.log(chalk.blue("[COUNT] Fetching Q&A count from server..."));
    const res = await axios.get(`https://jan-api-by-aminul-sordar.vercel.app/count`);
    console.log(chalk.green("[COUNT] Server count data:"), res.data);
    return res.data;
  } catch (e) {
    console.error(chalk.red("[COUNT] fetchCount error:"), e.message);
    return { questions: 0, answers: 0 };
  }
}

module.exports.run = async function ({ api, event, args, getText }) {
  const { threadID, messageID } = event;

  if (!args.length) {
    return api.sendMessage(getText("unknown_command"), threadID, messageID);
  }

  const command = args[0].toLowerCase();

  if (command === "teach") {
    const input = args.slice(1).join(" ").trim();

    if (!input) {
      return api.sendMessage(getText("teach_no_input"), threadID, messageID);
    }

    if (!input.includes(" - ")) {
      return api.sendMessage(getText("teach_wrong_format"), threadID, messageID);
    }

    const responseMessage = await teachMultiple(input);

    if (!responseMessage) {
      return api.sendMessage(getText("teach_fail"), threadID, messageID);
    }

    return api.sendMessage(formatString(getText("teach_success"), responseMessage), threadID, messageID);
  }

  if (command === "count") {
    const count = await fetchCount();

    return api.sendMessage(
      formatString(getText("count_info"), count.questions, count.answers),
      threadID,
      messageID
    );
  }

  return api.sendMessage(getText("unknown_command"), threadID, messageID);
};
