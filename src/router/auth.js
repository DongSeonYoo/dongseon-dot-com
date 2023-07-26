const express = require("express");
const router = express.Router();
const loginAuth = require("../middleware/loginAuth")

router.get("/",loginAuth(), (req, res) => {
  res.status(200).send({
    data: req.decoded,
  })
});

module.exports = router;