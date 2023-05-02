import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
    },
    accountBalance: { type: Number, min: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    accountStatus: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Account", accountSchema);
