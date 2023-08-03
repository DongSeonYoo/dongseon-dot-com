const express = require("express");
const router = express.Router();
const loginAuth = require("../middleware/loginAuth");
const adminAuth = require('../middleware/adminAuth');

router.get("/login", loginAuth, (req, res) => {
    req.decoded.iat = new Date(req.decoded.iat * 1000);
    res.status(200).send({
        data: req.decoded,
    });
});

router.get("/admin", adminAuth, (req, res) => {
    req.decoded.iat = new Date(req.decoded.iat * 1000);
    res.status(200).send({
        data: req.decoded,
    });
});

module.exports = router;
