const { bot } = require("../bot");
const User = require("../../model/User");
const { loginKeyboard } = require("../keyboards");

const start = async (msg) => {
  const chatId = msg.chat.id;
  try {
    const user = await User.findOne({ chatId }).lean();

    if (!user) {
      const newUser = new User({
        chatId,
        action: "start",
      });
      await newUser.save();
    }

    bot.sendMessage(
      chatId,
      `Assalomu alaykum ${msg.chat.first_name}. Botga xush kelibsiz!\n\nBotdan foydalanmoqchi bo'lsagiz tizimga kiring.`,
      {
        ...loginKeyboard
      }
    );
  } catch (error) {
    console.log(error);
    bot.sendMessage(chatId, messages.error.something_went_wrong || "Xatolik yuz berdi");
  }
};

module.exports = start;
