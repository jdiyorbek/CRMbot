const { bot } = require("../bot");
const User = require("../../model/User");
const { checkPhoneNumber } = require("../../utils/regexChecker");
const axios = require("axios");
const messages = require("../../data/messages.json");
const { menuKeyboard } = require("../keyboards");

const login = async (msg) => {
  const chatId = msg.chat.id;
  try {
    const user = await User.findOne({ chatId });
  
    if (!user) {
      require("../helper/start")(msg);
    } else if (user.active) {
      bot.sendMessage(chatId, messages.auth.already_logged_in);
    } else {
      await User.findOneAndUpdate({ chatId }, { action: "request_phone" });
      bot.sendMessage(chatId, messages.auth.enter_your_phone_number);
    }
  } catch (error) {
    console.log(error);
    bot.sendMessage(chatId, messages.error.something_went_wrong);
  }
};

const requestPhone = async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  try {
    if (!checkPhoneNumber(text)) {
      bot.sendMessage(chatId, messages.auth.phone_number_format_is_incorrect);
      return;
    }

    const updatedUser = await User.findOneAndUpdate({ chatId }, { phone: text, action: "request_password" }).lean();

    bot.sendMessage(chatId, messages.auth.enter_your_password, { keyboard: [] });
  } catch (error) {
    console.log(error);
    bot.sendMessage(chatId, messages.error.something_went_wrong);
  }
};

async function pingServer() {
  try {
    await axios.get(`${process.env.BASE_URL}/api/v1/ping-check`);
    return true;
  } catch (error) {
    return false;
  }
}

const requestPassword = async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  try {
    const user = await User.findOne({ chatId }).lean();
    if (!user) {
      bot.sendMessage(chatId, messages.error.something_went_wrong);
      return;
    }

    await pingServer();

    const response = await axios
      .get(
        `${process.env.BASE_URL}/api/v1/auth/login/student?phone=${user.phone}&chat_id=${chatId}&password=${text}`, {
        headers: {
          "Content-Type": "application/json",
        },
      }
      )
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
      });

    if (response.data.ok && response.data.data) {
      let user = response.data.data;

      await User.findOneAndUpdate({ chatId }, {
        data: {
          studentId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          slug: user.slug,
          gender: user.gender,
        },
        token: user.token,
        action: "menu",
        loggedIn: true
      })
        .then(() => {
          bot.sendMessage(chatId, messages.auth.login_success, {
            parse_mode: "Markdown",
            ...menuKeyboard
          });
        })
        .catch((error) => {
          throw error;
        });
    } else {
      await bot.sendMessage(
        chatId,
        messages.auth.phone_or_password_is_incorrect
      );
      login(msg);
    }
  } catch (error) {
    console.log(error);
    bot.sendMessage(chatId, messages.error.something_went_wrong || "Xatolik yuz berdi");

    login(msg);
  }
};

module.exports = { login, requestPhone, requestPassword };