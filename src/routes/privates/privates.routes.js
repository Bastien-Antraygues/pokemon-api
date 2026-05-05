import express from "express";

const router = express.Router();

router.get("/secret", (req, res) => {
  res.json({ message: "This is a secret message for authenticated users only!" });
});

export default router;