const express = require("express");
const router = express.Router();
const controller = require("../controllers/userSettings.controller");
const { verifyToken } = require("../middlewares/authJwt");

router.get("/", verifyToken ,controller.getSettings);
router.put("/", verifyToken ,controller.updateSettings);

module.exports = router;
