import React, { useState, useEffect } from "react";
import axios from "axios";

function PaymentHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments/history/current-user-id`);
      setHistory(response.data);
    }
    fetchHistory();
  }, []);

  const requestRefund = async (invoiceId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/refund-payment`, {
        invoiceId,
      });
      alert("Refund Successful!");
      // Refresh the payment history to reflect the updated status
      const updatedHistory = history.map((invoice) =>
        invoice.invoiceId === invoiceId ? { ...invoice, status: "REFUNDED" } : invoice
      );
      setHistory(updatedHistory);
    } catch (error) {
      console.error("Refund failed:", error.response ? error.response.data : error.message);
      alert("Refund failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Payment History</h2>
      <ul>
        {history.map((invoice) => (
          <li key={invoice._id}>
            Invoice ID: {invoice.invoiceId} | Amount: ${invoice.amount} | Status: {invoice.status}
            {invoice.status !== "REFUNDED" && (
              <button
                onClick={() => requestRefund(invoice.invoiceId)}
                className="btn btn-warning ml-3"
              >
                Request Refund
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PaymentHistory;
