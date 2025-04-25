const { bot } = require("../bot");
const User = require("../../model/User");
const axios = require("axios");
const { selectCourse } = require("../keyboards");

const enterToClass = async (msg) => {
  const chatId = msg.chat.id;
  try {
    const user = await User.findOne({chatId}).lean();

    const courses = await axios.get(
        `${process.env.BASE_URL}/api/v1/student/getAllCourses?id=${user.data.studentId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(data => {
      return data.data;
    }).catch(err => {
      throw err;
    });

    console.log(courses);
    
    const selectKeyboard = selectCourse(courses, user.data.eduId, user.data.studentId);

    console.log(selectKeyboard);

    bot.sendMessage(chatId, "Kursni tanlang", {
      ...selectKeyboard
    });
  }catch (error) {
    console.log(error);
    bot.sendMessage(chatId, messages.error.something_went_wrong || "Xatolik yuz berdi");
  }
}

module.exports = { enterToClass };