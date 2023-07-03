const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/:pageName", (req, res) => {
  const pageName = req.params.pageName;
  const filePath = path.join(__dirname, `../../client/pages/${pageName}.html`);
  res.sendFile(filePath);
});

router.get("/:pageName/:pathVariable", (req, res) => {
  const pageName = req.params.pageName;
  const filePath = path.join(__dirname, `../../client/pages/${pageName}.html`);
  res.sendFile(filePath);
})

module.exports = router;