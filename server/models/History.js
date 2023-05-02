import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
    {
        type: { type: String, enum: ['deposit', 'withdraw'], required: true },
        amount: { type: Number, min: 1, required: true, },
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
        to: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
    },
    { timestamps: true }
);

export default mongoose.model("Account", historySchema);