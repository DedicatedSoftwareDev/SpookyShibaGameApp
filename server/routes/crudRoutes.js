const express = require("express");
const router = express.Router();
const Controller = require("../controllers/Controller");

router.post("/add", Controller.add_earn);
router.get("/history/:address", Controller.get_history);
router.get("/time/:address", Controller.get_time);

module.exports = router;
