const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const homepageController = require("../controllers/homepageSettings.controller");
const { verifyToken, isAdmin } = require("../middlewares/authJwt");

router.get("/", homepageController.getSettings);

router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  homepageController.updateSettings
);

module.exports = router;
