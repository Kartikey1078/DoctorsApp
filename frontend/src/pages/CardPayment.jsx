/* global Square */
import { useEffect, useState } from "react";

function CardPayment() {
  const [card, setCard] = useState(null);

  useEffect(() => {
    async function loadCard() {
      const payments = Square.payments(
        process.env.REACT_APP_SQUARE_APP_ID,
        process.env.REACT_APP_SQUARE_LOCATION_ID
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

      await fetch("http://localhost:4000/api/payment/square", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: token,
          amount: 10,
        }),
      });
    }
  }

  return (
    <div>
      <div id="card-container"></div>
      <button onClick={handlePay}>Pay Now</button>
    </div>
  );
}

export default CardPayment;
