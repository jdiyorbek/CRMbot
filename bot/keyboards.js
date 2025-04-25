const loginKeyboard = {
  reply_markup: {
    keyboard: [
      [
        {
          text: "Tizimga kirish ➡️",
        },
      ],
    ],
    one_time_keyboard: true,
    resize_keyboard: true,
  },
}

const menuKeyboard = {
  reply_markup: {
    keyboard: [
      [{
        text: "Profil👤",
      },{
        text: "📚Darsga kirish",
      }],
    ],
    resize_keyboard: true,
  },
}

const selectCourse = (courses, eduId, studentId) => {
  const mappedKb = courses.map((item) => {
    const keyboard = {
      reply_markup: {
        keyboard: [],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    }
    keyboard.reply_markup.keyboard.push([
      {
        text: `${item.course_name} (${item.start}-${item.end})`, 
        web_app: {url: `${process.env.QR_CODE_URL}/?edu_id=${eduId}&student_id=${studentId}&course_id=${item.courseId}&group_id=${item.groupId}`}
      }
    ]);  
    return keyboard;
  })
  const kb = mappedKb[0]
  kb.reply_markup.keyboard.push([{text: "⬅menuga qaytish"}]);
  return kb;
}
  

module.exports = {loginKeyboard, menuKeyboard, selectCourse}