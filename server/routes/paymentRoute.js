const express = require("express");
const asyncHandler = require("express-async-handler");
const paypal = require("@paypal/checkout-server-sdk");
const Invoice = require("../models/invoice"); // Invoice model for database tracking
const { client } = require("../config/paypalClient");

const router = express.Router();

// Create a new payment
router.post(
  "/create-payment",
  asyncHandler(async (req, res) => {
    const { hotelId, userId, amount } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount,
          },
          custom_id: `${hotelId}_${userId}`, // Store hotelId and userId for later reference
        },
      ],
    });

    const response = await client().execute(request);
    res.status(201).json({ id: response.result.id });
  })
);

// Capture payment
router.post(
  "/capture-payment",
  asyncHandler(async (req, res) => {
    const { orderID } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    const response = await client().execute(request);

    const { id, purchase_units } = response.result;

    // Create an invoice entry in the database
    const invoice = new Invoice({
      invoiceId: id,
      userId: purchase_units[0].custom_id.split("_")[1], // Extract userId
      hotelId: purchase_units[0].custom_id.split("_")[0], // Extract hotelId
      amount: purchase_units[0].amount.value,
      currency: purchase_units[0].amount.currency_code,
      status: response.result.status,
    });

    await invoice.save();

    res.status(201).json({
      status: response.result.status,
      order: response.result,
    });
  })
);

// Refund a payment
router.post(
  "/refund-payment",
  asyncHandler(async (req, res) => {
    const { invoiceId } = req.body; // The Invoice ID to process refund

    // Fetch the invoice from the database
    const invoice = await Invoice.findOne({ invoiceId });
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Request refund via PayPal
    const request = new paypal.payments.CapturesRefundRequest(invoice.invoiceId);
    request.requestBody({
      amount: {
        value: invoice.amount,
        currency_code: invoice.currency,
      },
    });

    const response = await client().execute(request);

    // Update the invoice status to "REFUNDED"
    invoice.status = "REFUNDED";
    await invoice.save();

    res.status(200).json({
      message: "Refund successful",
      refund: response.result,
    });
  })
);

// Get payment history for a user
router.get(
  "/history/:userId",
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const invoices = await Invoice.find({ userId });
    res.status(200).json(invoices);
  })
);

module.exports = router;
