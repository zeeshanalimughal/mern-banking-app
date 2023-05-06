import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
    },
    accountBalance: { type: Number, min: 0, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    accountStatus: { type: Boolean, default: true },
    checkDeposits: [{
      checkImage: { type: String },
      checkNumber: { type: String },
      isDeposited: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now() }
    }],
    accountType: { type: String, enum: ['checking', 'saving'], required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Account", accountSchema);
