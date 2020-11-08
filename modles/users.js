const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "请添加名字"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "请填写邮箱"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "请填写正确的邮箱地址",
    ],
  },
  password: {
    type: String,
    required: [true, "请添加密码"],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "user", "visitor"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 密码加密
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
})

// 生成令牌 token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, name: this.name }, process.env.JWT_SECRET, { expiresIn: '30d'});
}

// 匹配密码
UserSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
}

module.exports = mongoose.model("User", UserSchema);
