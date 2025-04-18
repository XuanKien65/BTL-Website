const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { verifyToken, isAdmin } = require("../middlewares/authJwt");

router.get("/", commentController.getAllComments);
router.get("/:id", commentController.getCommentById);
router.post("/", commentController.createComment);
router.put(
  "/:id/approve",
  [verifyToken, isAdmin],
  commentController.approveComment
);
router.put(
  "/:id/reject",
  [verifyToken, isAdmin],
  commentController.rejectComment
);
router.delete("/:id", [verifyToken, isAdmin], commentController.deleteComment);

module.exports = router;
