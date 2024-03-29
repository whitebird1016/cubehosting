import express from "express";
import Service from "../models/Service.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const serviceData = new Service({
      userid: req.body.userid,
      currentBlockData: req.body.currentBlockData,
      servername: req.body.servername,
      port: req.body.port,
    });
    serviceData.save();
    return res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const serviceData = await Service.find();
    return res.status(200).json({
      serviceData,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.userid && req.body.servername) {
      const serviceData = await Service.find();
      const filterdata = serviceData.filter(
        (data) =>
          data.userid === req.body.userid &&
          data.servername === req.body.servername
      );
      return res.status(200).json({
        filterdata,
      });
    }
    console.log("error");
  } catch (err) {
    console.log(err);
  }
});
router.post("/update", async (req, res) => {
  console.log(req.body);
  try {
    const serviceData = await Service.findOneAndUpdate(
      { _id: req.body._id },
      {
        $set: req.body,
      }
    );
    console.log(serviceData);
    return res.status(200).json({
      serviceData,
    });
  } catch (err) {
    console.log(err);
  }
});
export default router;
