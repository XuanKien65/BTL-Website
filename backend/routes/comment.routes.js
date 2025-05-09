const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const {
  verifyToken,
  isAdmin,
  isOwnerOrAdmin,
} = require("../middlewares/authJwt");

router.get("/", verifyToken, isAdmin, commentController.getAllComments);

router.get("/post/:postId", commentController.getCommentsByPostId);

router.get("/:id", commentController.getCommentById);

router.post("/", verifyToken, commentController.createComment);

router.put(
  "/:id/approved",
  verifyToken,
  isAdmin,
  commentController.approveComment
);
router.put(
  "/:id/reject",
  verifyToken,
  isAdmin,
  commentController.rejectComment
);

router.delete(
  "/:id",
  verifyToken,
  isOwnerOrAdmin,
  commentController.deleteComment
);

router.patch("/score/:id", verifyToken, commentController.updateScore);
router.get("/user/:userId", verifyToken, commentController.getCommentsByUserId);

module.exports = router;
