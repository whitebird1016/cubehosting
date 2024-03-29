import mongoose from "mongoose";

const CodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
  },
  used: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Code", CodeSchema);
