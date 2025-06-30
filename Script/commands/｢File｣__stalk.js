module.exports.config = {
    name: "stalk",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Islamick Cyber Chat",
    description: "View information of facebook user",
    commandCategory: "Information",
    usages: "info [reply/tag/id]",
    cooldowns: 3

};
module.exports.run = async({api,event,args}) => {
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const axios = global.nodemodule['axios'];  

    if(!args[0]){
    if(event.type == "message_reply") { uid = event.messageReply.senderID }
    else uid = event.senderID;
   const res = await axios.get(`https://www.nguyenmanh.name.vn/api/fbInfo?id=${uid}&apikey=ogDIVInu`);  
    var gender = res.data.result.gender == 'male' ? "Nam" : res.data.result.gender == 'female' ? "Female" : "You don't even know the gender?";
    var birthday = res.data.result.birthday ? `${res.data.result.birthday}` : "You were born on February 30th - year don't you remember-!!";
    var love = res.data.result.love ? `${res.data.result.love}` : "Are you still F.A sml???"
    var website = res.data.result.website ? `${res.data.result.website}` : "There is currently no website"
    var about = res.data.result.about ? `${res.data.result.about}` : "Don't you have anything to say yourself???" 
    var quotes = res.data.result.quotes ? `${res.data.result.quotes}` : "Don't you have one quote in your life???"  
    var relationship = res.data.result.relationship ? `${res.data.result.relationship}` : "I don't have a lover yet!!!!"
    var location = res.data.result.location ? `${res.data.result.location}` : "You are not on Earth right now!!!"
  var hometown = res.data.result.hometown ? `${res.data.result.hometown}` : "You don't even know where you're from?"
    var url_profile = res.data.result.profileUrl  ? `${res.data.result.profileUrl}` : `${url_profile}`
    var callback = () => api.sendMessage({body:`╭•┄┅═══❁🌺❁════┅┄•╮\n𝐅𝐁 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍\n ╰•┄┅═══❁🌺❁═══┅┄•╯\n\n｢👤｣•—»✨ Name: ${res.data.result.name}\n｢🔎｣•—»✨ UID: ${uid}\n｢👀｣•—»✨ Follow: ${res.data.result. follow}\n｢👭｣•—»✨ Gender: ${gender}\n｢🎉｣•—»✨ Birthday: ${birthday}\n｢💌｣•—»✨ Fate name: ${love }\n｢❤️｣•—»✨ Relationship: ${relationship}\n｢🏡｣•—»✨ Lives in: ${location}\n｢🌏｣•—»✨ Location: ${hometown} \n｢👉｣•—»✨ Introduce myself:\n${about}\n｢📝｣•—»✨ Quote:\n${quotes}\n｢🌐｣•—»✨ Website: ${website }\n｢📌｣•—»✨ Personal URL: ${url_profile}`,
        attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID,
        () => fs.unlinkSync(__dirname + "/cache/1.png"),event.messageID); 
    return request(encodeURI(`https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',
        () => callback());
   }

    else {
    if (args.join().indexOf('@') !== -1){
    var mentions = Object.keys(event.mentions)
    const res = await axios.get(`https://nguyenmanh.name.vn/api/fbInfo?id=${mentions}&apikey=ogDIVInu`);  
   var gender = res.data.result.gender == 'male' ? "Nam" : res.data.result.gender == 'female' ? "Female" : "You don't even know the gender?";
    var birthday = res.data.result.birthday ? `${res.data.result.birthday}` : "You were born on February 30th - year don't you remember-!!";
    var love = res.data.result.love ? `${res.data.result.love}` : "Are you still F.A sml???"
    var website = res.data.result.website ? `${res.data.result.website}` : "There is currently no website"
    var about = res.data.result.about ? `${res.data.result.about}` : "Don't you have anything to say yourself???" 
    var quotes = res.data.result.quotes ? `${res.data.result.quotes}` : "Don't you have one quote in your life???"  
    var relationship = res.data.result.relationship ? `${res.data.result.relationship}` : "I don't have a lover yet!!!!"
    var location = res.data.result.location ? `${res.data.result.location}` : "You are not on Earth right now!!!"
  var hometown = res.data.result.hometown ? `${res.data.result.hometown}` : "You don't even know where you're from?"
    var url_profile = res.data.result.profileUrl  ? `${res.data.result.profileUrl}` : `${url_profile}`
    var callback = () => api.sendMessage({body:`╭•┄┅═══❁🌺❁═══┅┄•╮\n𝐅𝐁 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍\n╰•┄┅═══❁🌺❁═══┅┄•╯\n\n｢👤｣•—»✨ Name: ${res.data.result.name}\n｢🔎｣•—»✨ UID: ${uid}\n｢👀｣•—»✨ Follow: ${res.data.result. follow}\n｢👭｣•—»✨ Gender: ${gender}\n｢🎉｣•—»✨ Birthday: ${birthday}\n｢💌｣•—»✨ Fate name: ${love }\n｢❤️｣•—»✨ Relationship: ${relationship}\n｢🏡｣•—»✨ Lives in: ${location}\n｢🌏｣•—»✨ Location: ${hometown} \n｢👉｣•—»✨ Introduce myself:\n${about}\n｢📝｣•—»✨ Quote:\n${quotes}\n｢🌐｣•—»✨ Website: ${website }\n｢📌｣•—»✨ Personal URL: ${url_profile}`,
        attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID,
        () => fs.unlinkSync(__dirname + "/cache/1.png"),event.messageID); 
    return request(encodeURI(`https://graph.facebook.com/${mentions}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',
        () => callback());
    }
    else {
      var res_ID = await api.getUID(args[0])
    const res = await axios.get(`https://www.nguyenmanh.name.vn/api/fbInfo?id=${res_ID}&apikey=ogDIVInu`);  
  var gender = res.data.result.gender == 'male' ? "Nam" : res.data.result.gender == 'female' ? "Female" : "You don't even know the gender?";
    var birthday = res.data.result.birthday ? `${res.data.result.birthday}` : "You were born on February 30th - year don't you remember-!!";
    var love = res.data.result.love ? `${res.data.result.love}` : "Are you still F.A sml???"
    var website = res.data.result.website ? `${res.data.result.website}` : "There is currently no website"
    var about = res.data.result.about ? `${res.data.result.about}` : "Don't you have anything to say yourself???" 
    var quotes = res.data.result.quotes ? `${res.data.result.quotes}` : "Don't you have one quote in your life???"  
    var relationship = res.data.result.relationship ? `${res.data.result.relationship}` : "I don't have a lover yet!!!!"
    var location = res.data.result.location ? `${res.data.result.location}` : "You are not on Earth right now!!!"
  var hometown = res.data.result.hometown ? `${res.data.result.hometown}` : "You don't even know where you're from?"
    var url_profile = res.data.result.profileUrl  ? `${res.data.result.profileUrl}` : `${url_profile}`
    var callback = () => api.sendMessage({body:`╭•┄┅══❁🌺❁══┅┄•╮\n𝐅𝐁 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍\n╰•┄═══❁🌺❁══┅┄•╯\n\n｢👤｣•—»✨ Name: ${res.data.result.name}\n｢🔎｣•—»✨ UID: ${uid}\n｢👀｣•—»✨ Follow: ${res.data.result. follow}\n｢👭｣•—»✨ Gender: ${gender}\n｢🎉｣•—»✨ Birthday: ${birthday}\n｢💌｣•—»✨ Fate name: ${love }\n｢❤️｣•—»✨ Relationship: ${relationship}\n｢🏡｣•—»✨ Lives in: ${location}\n｢🌏｣•—»✨ Location: ${hometown} \n｢👉｣•—»✨ Introduce myself:\n${about}\n｢📝｣•—»✨ Quote:\n${quotes}\n｢🌐｣•—»✨ Website: ${website }\n｢📌｣•—»✨ Personal URL: ${url_profile}`,
        attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID,
        () => fs.unlinkSync(__dirname + "/cache/1.png"),event.messageID); 
    return request(encodeURI(`https://graph.facebook.com/${res_ID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',
        () => callback());
    }
  }
}
