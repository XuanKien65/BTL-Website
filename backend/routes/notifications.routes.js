const express = require("express");
const router = express.Router();
const notiController = require("../controllers/notifications.controller");
const { verifyToken } = require("../middlewares/authJwt");

router.post("/", notiController.sendNotification);
router.get("/", verifyToken, notiController.getMyNotifications);
router.get("/unread-count", verifyToken, notiController.getUnreadCount);
router.put("/read/:id", verifyToken, notiController.markAsRead);
router.put("/read-all", verifyToken, notiController.markAllAsRead);

router.delete("/:id", [verifyToken], notiController.deleteNotification);
module.exports = router;
