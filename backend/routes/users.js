import express from "express";
import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
const { hash } = bcrypt;

dotenv.config();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    return res.status(200).json({
      user,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const { userinfo, password } = req.body;
  if (!userinfo)
    return res.status(400).json({
      message: "Please Enter Your UserInfo",
    });
  if (!password)
    return res.status(400).json({
      message: "Please Enter Your Password",
    });
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = regex.test(userinfo);
  let user = [];
  if (isValidEmail) {
    user = await User.findOne({ email: userinfo });
  } else {
    user = await User.findOne({ username: userinfo });
  }
  try {
    if (!user) {
      return res.status(400).json({
        message: "User is not found",
      });
    } else {
      bcrypt.compare(password, user?.password, async (err, response) => {
        if (response === true) {
          return res.status(200).json({
            user: user,
          });
        } else {
          return res.status(400).json({
            message: "Password is incorrect",
          });
        }
      });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/adduser", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const user2 = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).json({
        message: "Already Exist",
      });
    }
    if (user2) {
      return res.status(400).json({
        message: "Already Exist",
      });
    } else {
      bcrypt.genSalt(10, async (err, salt) => {
        bcrypt.hash(req.body.password, salt, async (err, hash) => {
          const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
          });
          newUser.save();
          return res.status(200).json({ user: newUser });
        });
      });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/checkValidUser", async (req, res) => {
  try {
    const userInfo = req.body.data;
    const user = await User.findOne({ email: userInfo });
    const user2 = await User.findOne({ username: userInfo });
    if (!user && !user2) {
      return res.status(200).json({
        success: false,
        message: "Not Exist",
      });
    }
    const sendData = user ? user : user2;
    return res.status(200).json({
      success: true,
      message: "Exist",
      data: sendData,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

export default router;
