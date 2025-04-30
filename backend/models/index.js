const db = require("../config/db.config");
const User = require("./user.model");
const Post = require("./post.model");
const Category = require("./category.model");
const Comment = require("./comment.model");

module.exports = {
  db,
  User,
  Post,
  Category,
  Comment,
};
