const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken, isAdmin } = require("../middlewares/authJwt");

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
//refresh
router.post("/refresh", authController.requestRefreshToken);
//logout
router.post("/logout", [verifyToken], authController.userLogout);
//change password
router.post("/verify-password", [verifyToken], authController.verifyPassword);
module.exports = router;
