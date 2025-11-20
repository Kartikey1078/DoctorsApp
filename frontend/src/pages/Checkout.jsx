/* global Square */
import { useEffect, useState } from "react";

function Checkout() {
  const [card, setCard] = useState(null);

  useEffect(() => {
    async function loadCard() {
      const payments = Square.payments(
        import.meta.env.VITE_SQUARE_APP_ID,
        import.meta.env.VITE_SQUARE_LOCATION_ID
      );

      const cardElement = await payments.card();
      await cardElement.attach("#card-container");
      setCard(cardElement);
    }

    loadCard();
  }, []);

  async function handlePay() {
    if (!card) return;

    const result = await card.tokenize();
    if (result.status === "OK") {
      const token = result.token;

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/square`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId: token, amount: 10 }), // amount in USD
      });

      const data = await res.json();
      console.log(data);
      alert(data.success ? "Payment successful!" : "Payment failed");
    } else {
      alert("Card tokenization failed");
    }
  }

  return (
    <div>
      <h2>Pay with Square</h2>
      <div id="card-container"></div>
      <button onClick={handlePay}>Pay $10</button>
    </div>
  );
}

export default Checkout;
