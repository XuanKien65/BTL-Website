const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken, isAdmin } = require("../middlewares/authJwt");

router.get("/", [verifyToken, isAdmin], userController.getAllUsers);
router.get("/:id", [verifyToken], userController.getUserById);
router.put("/:id", [verifyToken], userController.updateUser);
router.delete("/:id", [verifyToken, isAdmin], userController.deleteUser);

module.exports = router;
