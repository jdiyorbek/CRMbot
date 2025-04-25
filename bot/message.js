const User = require("../model/User");
const { bot } = require("./bot");
const { backToMenu,help } = require("./helper/commands");
const { enterToClass } = require("./helper/enterToClass");
const { login, requestPhone, requestPassword } = require("./helper/login");
const { showProfile } = require("./helper/profile");
const start = require("./helper/start");
const { menuKeyboard } = require("./keyboards");

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  try {
    const user = await User.findOne({ chatId }).lean();

    if (user) {
      if (text.startsWith("/")) {
        if (text === "/start") {
          start(msg);
        } else if (text === "/help") {
          help(msg);
        }
      } else if (text === "⬅menuga qaytish") {
        backToMenu(msg)
      } else if (text === "Profil👤" && user.loggedIn){
        showProfile(msg);
      } else if (text === "Tizimga kirish ➡️" && user.action === "start") {
        login(msg);
      } else if (user.action == "request_phone") {
        requestPhone(msg);
      } else if (user.action == "request_password") {
        requestPassword(msg)
      } else if (user.action === "menu" && text === "📚Darsga kirish"){
        enterToClass(msg)
      } else {
        bot.sendMessage(chatId, "Menudan kerakli opsiyani tanlang", {
          ...menuKeyboard
        })
      }
    } else {
      start(msg);
    }
  } catch (error) {
    console.log(error);
    bot.sendMessage(chatId, messages.error.something_went_wrong || "Xatolik yuz berdi");
  }
});
