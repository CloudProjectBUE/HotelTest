const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Completed", "Pending", "Refunded"], default: "Pending" },
    paymentMethod: { type: String, enum: ["PayPal", "Card"], default: "PayPal" },
    orderId: { type: String }, // PayPal Order ID or similar
    createdAt: { type: Date, default: Date.now },
    refundedAt: { type: Date }, // Optional, only filled if refunded
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
