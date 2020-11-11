const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxlength:100,
    required: [true, "请添加评论标题"],
  },
  text: {
    type: String,
    required: [true, "请填写评论内容"],
  },
  rating: {
    type: Number,
    min: 1,
    max:10,
    required: [true, "请评分, 1~10"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  mscamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Mscamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
