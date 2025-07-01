module.exports.config = {
  name: "admin",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "aminulsordar",
  description: "Bot operator information",
  commandCategory: "info",
  cooldowns: 1
};

module.exports.languages = {
  en: {
    message: `    THE BOT OPERATOR
             🇧🇩🇦🇷🇦🇷🇦🇷➕️➕️➕🇦🇷🇦🇷🇦🇷
╔══❀══◄░❀░►══❀══╗
 -NAME ➪ ༒ 𝐂𝐄𝐎-⸙ ABIR-❯⸙๏

 -Gender ➪ Male 🍂💜

 -Age ➪ 18+ 🥀✨

 -Relationship ➪ Single

 -Work ➪ Student

 -Game ➪ Fire Lover 

 -Facebook ➪ https://www.facebook.com/br4nd.abir.your.next.bf.fan

 -LC ➪ "Hey, I say I love you because I do" 🥱

 -Page ➪ https://www.facebook.com/br4nd.abir.your.next.bf.fan

 -FIRE ➪ ️༒ 𝐂𝐄𝐎℅ABIR-❯⸙๏🥺🔫̷

 -WhatsApp + Imo ➪ No gf so not giving 🥱01704407109

 -Telegram ➪ 01704407109 🥺🔥🥰

 -Mail ➪ Inbox me if needed

╚══❀══◄░❀░►══❀══╝`
  },

  vi: {
    message: `    NGƯỜI ĐIỀU HÀNH BOT
             🇧🇩🇦🇷🇦🇷🇦🇷➕️➕️➕🇦🇷🇦🇷🇦🇷
╔══❀══◄░❀░►══❀══╗
 -Tên ➪ ༒ 𝐂𝐄𝐎-⸙ ABIR-❯⸙๏

 -Giới tính ➪ Nam 🍂💜

 -Tuổi ➪ 18+ 🥀✨

 -Tình trạng ➪ Độc thân

 -Công việc ➪ Học sinh

 -Game yêu thích ➪ Fire Lover

 -Facebook ➪ https://www.facebook.com/br4nd.abir.your.next.bf.fan

 -LC ➪ "Nói yêu là vì thực sự yêu" 🥱

 -Trang ➪ https://www.facebook.com/br4nd.abir.your.next.bf.fan

 -FIRE ➪ ️༒ 𝐂𝐄𝐎℅ABIR-❯⸙๏🥺🔫̷

 -WhatsApp + Imo ➪ Không có người yêu nên không cho 🥱01704407109

 -Telegram ➪ 01704407109 🥺🔥🥰

 -Mail ➪ Inbox nếu cần

╚══❀══◄░❀░►══❀══╝`
  }
};

module.exports.run = async function ({ api, event, getText }) {
  return api.sendMessage(getText("message"), event.threadID, event.messageID);
};
