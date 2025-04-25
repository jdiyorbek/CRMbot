const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  data: {
    type: new Schema({
      studentId: {
        type: String,
        required: false,
      },
      firstName: {
        type: String,
        required: false,
      },
      lastName: {
        type: String,
        required: false,
      },
      eduId: {
        type: String,
        required: false,
      },
      slug: {
        type: String,
        required: false,
      },
      gender: {
        type: String,
        required: false,
      },
    }),
    validate: {
      validator: function (v) {
        if (!v) return false;
        return v.studentId && v.firstName && v.lastName && v.eduId && v.slug && v.gender;
      },
      message: "Foydalanuvchi ma'lumotlari to'liq emas",
    },
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  token: {
    type: String,
    required: false,
  },
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  action: {
    type: String,
    required: true,
  },
  loggedIn: {
    type: Boolean,
    required: false,
    default: false,
  },
});
module.exports = model("User", userSchema);