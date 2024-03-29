import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  userid: {
    type: String,
  },
  currentBlockData: {
    type: Number,
  },
  servername: {
    type: String,
  },
  changedname: {
    type: String,
  },
});

export default mongoose.model("Service", ServiceSchema);
