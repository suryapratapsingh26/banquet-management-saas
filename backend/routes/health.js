const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "BQT Backend"
  });
});

module.exports = router;
