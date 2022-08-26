const controller = require("../controllers/controller");
const express = require("express");
const router = express.Router();

router.get("/", controller.index);
router.post("/view", controller.register);
router.get("/view", controller.view);
router.get("/login", controller.login);
router.post("/login", controller.loginp);
router.get("/delete/:id", controller.deleteapi);
router.get("/name/:name", controller.nameapi);


// 
module.exports = router;