import React from 'react';
import { PayPalButton } from "react-paypal-button-v2";

function PaymentForm() {
    return (
        <div>
            <PayPalButton
                amount="100.00"
                onSuccess={(details, data) => {
                    alert("Transaction completed by " + details.payer.name.given_name);
                }}
                options={{
                    clientId: "YOUR_PAYPAL_CLIENT_ID"
                }}
            />
        </div>
    );
}

export default PaymentForm;
