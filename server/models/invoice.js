const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema(
  {
    invoiceId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, default: "COMPLETED" },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
