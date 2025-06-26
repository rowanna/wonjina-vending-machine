import { useState } from "react";
import "./VendingMachine.css";

const DRINKS = [
  { name: "콜라", price: 1100, stock: 3 },
  { name: "물", price: 600, stock: 2 },
  { name: "커피", price: 700, stock: 1 },
];

const VALID_CARDS = ["현대", "삼성", "국민"];

export default function VendingMachine() {
  const [drinks, setDrinks] = useState(DRINKS);
  const [selectedDrink, setSelectedDrink] = useState<{
    name: string;
    price: number;
  } | null>(null);
  const [screenMessage, setScreenMessage] = useState("음료를 선택해주세요");
  const [slotMessage, setSlotMessage] = useState("→ 음료가 나오는 곳 ←");
  const [step, setStep] = useState<"drink" | "payment-type" | "card" | "cash">(
    "drink"
  );
  const [insertedCash, setInsertedCash] = useState<number>(0);

  const selectDrink = (drinkName: string) => {
    const drink = drinks.find((d) => d.name === drinkName);
    if (!drink) return;

    if (drink.stock <= 0) {
      alert(`'${drink.name}' 재고가 없습니다.`);
      return;
    }

    setSelectedDrink(drink);
    setScreenMessage(`'${drink.name}' 선택됨. 결제 방식을 골라주세요`);
    setStep("payment-type");
  };

  const updateDrinkStock = (drinkName: string) => {
    setDrinks((prev) =>
      prev.map((d) => (d.name === drinkName ? { ...d, stock: d.stock - 1 } : d))
    );
  };

  const payWithCard = (card: string) => {
    if (!VALID_CARDS.includes(card)) {
      setScreenMessage(`'${card}' 카드는 사용 불가합니다`);
      return;
    }

    setScreenMessage(`${card} 카드로 '${selectedDrink?.name}' 결제 완료!`);
    setSlotMessage(`${selectedDrink?.name} 나오는 중...`);
    if (selectedDrink) updateDrinkStock(selectedDrink.name);
    resetAfterDelay();
  };

  const addCash = (amount: number) => {
    const newTotal = insertedCash + amount;
    setInsertedCash(newTotal);

    if (selectedDrink && newTotal >= selectedDrink.price) {
      const change = newTotal - selectedDrink.price;

      let message = `현금 ${newTotal.toLocaleString()}원 결제 완료!`;
      if (change > 0) {
        message += ` 거스름돈 ${change.toLocaleString()}원 반환`;
      }

      setScreenMessage(message);
      setSlotMessage(`${selectedDrink.name} 나오는 중...`);
      if (selectedDrink) updateDrinkStock(selectedDrink.name);

      resetAfterDelay();
    } else {
      setScreenMessage(
        `현금 ${newTotal.toLocaleString()}원 투입됨. ${selectedDrink?.price.toLocaleString()}원 필요`
      );
    }
  };

  const resetAfterDelay = () => {
    setTimeout(() => {
      setScreenMessage("음료를 선택해주세요");
      setSlotMessage("→ 음료가 나오는 곳 ←");
      setSelectedDrink(null);
      setInsertedCash(0);
      setStep("drink");
    }, 3000);
  };

  return (
    <div>
      <h1>Vending Machine</h1>
      <div className="vending-machine">
        <div className="screen">{screenMessage}</div>

        {step === "drink" && (
          <div className="buttons">
            {drinks.map((drink) => (
              <button
                key={drink.name}
                className="drink-btn"
                onClick={() => selectDrink(drink.name)}
                disabled={drink.stock <= 0}
                style={{ opacity: drink.stock <= 0 ? 0.5 : 1 }}
              >
                {drink.name} <span>{drink.price.toLocaleString()}원</span>
                <div style={{ fontSize: "0.8em" }}>재고: {drink.stock}</div>
              </button>
            ))}
          </div>
        )}

        {step === "payment-type" && (
          <div className="payment-section">
            <button className="payment-btn" onClick={() => setStep("card")}>
              카드 결제
            </button>
            <button className="payment-btn" onClick={() => setStep("cash")}>
              현금 결제
            </button>
          </div>
        )}

        {step === "card" && (
          <div className="payment-section">
            <div>카드 종류 선택:</div>
            {["현대", "삼성", "국민", "롯데", "농협"].map((card) => (
              <button
                key={card}
                className="payment-btn"
                onClick={() => payWithCard(card)}
              >
                {card} 카드
              </button>
            ))}
          </div>
        )}

        {step === "cash" && (
          <div className="payment-section">
            <div>현금 투입:</div>
            <div className="payment-cash-section">
              {[100, 500, 1000, 5000, 10000].map((amount) => (
                <button
                  key={amount}
                  className="payment-btn"
                  onClick={() => addCash(amount)}
                >
                  {amount.toLocaleString()}원
                </button>
              ))}
            </div>
            <div>누적 투입 금액: {insertedCash.toLocaleString()}원</div>
          </div>
        )}

        <div className="slot">{slotMessage}</div>
      </div>
    </div>
  );
}
