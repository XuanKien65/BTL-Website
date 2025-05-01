const express = require("express");
const router = express.Router();
const viewedPostController = require("../controllers/viewedPost.controller");
const { verifyToken } = require("../middlewares/authJwt");
router.get(
  "/user/:userId",
  verifyToken,
  viewedPostController.getViewedPostsByUser
);

module.exports = router;
