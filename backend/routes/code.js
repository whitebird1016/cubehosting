import express from "express";
import Code from "../models/Code.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const expiration = new Date(req.body.expiration);
    const codeData = new Code({
      code: req.body.code,
      expiration: expiration,
    });
    codeData.save();
    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/use", async (req, res) => {
  try {
    const { code, userId } = req.body;
    const codeDB = await Code.findOne({
      code: code,
    });
    if (!codeDB) {
      return res.status(400).json({ message: "invalid code" });
    }
    if (codeDB.expiration < new Date()) {
      return res.status(400).json({ message: "expired code" });
    }
    const used = [...codeDB.used];
    used.push({
      userId: userId,
      servername: req.body.servername,
      currentBlockData: req.body.currentBlockData,
      date: new Date(),
    });
    await Code.findOneAndUpdate({ code: code }, { used: used });
    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/validateCode", async (req, res) => {
  try {
    const { code } = req.body;
    const codeDB = await Code.findOne({ code: code });
    if (codeDB) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/updateExpiration", async (req, res) => {
  try {
    const { code, expiration } = req.body;
    const _expiration = new Date(expiration);
    const codeDB = await Code.findOne({ code: code });
    if (!codeDB) {
      return res.status(200).json({ success: false });
    } else {
      await Code.findOneAndUpdate({ code: code }, { expiration: _expiration });
      return res.status(200).json({ success: true });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { code } = req.body;
    await Code.findOneAndDelete({ code: code });
    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
  }
});

router.get("/getCodes", async (req, res) => {
  try {
    const codes = await Code.find();
    return res.status(200).json({ data: codes });
  } catch (err) {
    console.log(err);
  }
});

export default router;
