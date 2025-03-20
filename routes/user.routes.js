const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users.controller");
const auth = require("../middlewares/auth");

router.post("/login", userCtrl.login);
//router.post('/signup', userCtrl.signup);
router.get("/protected-route", auth, (req, res) => {
  res
    .status(200)
    .json({ message: "Accès autorisé !", userId: req.auth.userId });
});

module.exports = router;
