const { bot } = require("../bot");
const User = require("../../model/User");
const { login } = require("./login");
const { default: axios } = require("axios");
const messages = require("../../data/messages.json");

const showProfile = async (msg) => {
  const chatId = msg.chat.id;
  try {
    const user = await User.findOne({ chatId }).lean();
    
    if(!user){
      bot.sendMessage(chatId, messages.profile.you_are_not_logged_in);
      login(msg);
      return;
    }

    let {firstName, lastName} = user.data;
    let {phone} = user;

    const courses = await axios.get(`${process.env.BASE_URL}/api/v1/student/getAllCourses?id=${user.data.studentId}`).then((data) => {
      return data.data;
    })
    console.log(courses);
    
    
    let listCourse = ""

    for(let i = 0; i < courses.length; i++){
      if(courses.length === i + 1){
        listCourse += courses[i].course_name
      } else {
        listCourse += courses[i].course_name + ", "
      }
    }   

    const newMsg = `Ismingiz: ${firstName}\nFamilyangiz: ${lastName}\nKurslaringiz: ${listCourse}\nTelefon raqamingiz: ${phone}\n`

    if(firstName && lastName && courses && phone){
      bot.sendMessage(chatId, newMsg);
    }
  } catch (error) {
    console.log(error);
    bot.sendMessage(chatId, messages.error.something_went_wrong || "Xatolik yuz berdi");
  }
}

module.exports = { showProfile };