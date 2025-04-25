const User = require("../../model/User");
const { bot } = require("../bot");
const { menuKeyboard } = require("../keyboards");
const messages = require("../../data/messages.json");

const help = (msg) => {
  const chatId = msg.chat.id;
  try {
    bot.sendMessage(chatId, "Yordam")
  } catch (error) {
    console.log(error);
    bot.sendMessage(chatId, messages.error.something_went_wrong);
  }
}

const backToMenu = async(msg) => {
  const chatId = msg.chat.id;
  try {
    const updatedUser = await User.findOneAndUpdate({chatId}, {action: "menu"}).lean();
    
    if(!updatedUser) {
      bot.sendMessage(chatId, "Siz menuga qaytish uchun ro'yxatdan o'tmagansiz")
      return
    }      

    bot.sendMessage(chatId, "Menuga qaytdingiz", {
      ...menuKeyboard
    })
  } catch (error) {
    console.log(error);
    bot.sendMessage(chatId, messages.error.something_went_wrong || "Xatolik yuz berdi");
  }
}

module.exports = {help, backToMenu}