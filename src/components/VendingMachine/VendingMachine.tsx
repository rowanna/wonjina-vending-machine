import { useState } from "react";
import "./VendingMachine.css";
import {
  DRINKS,
  VALID_CARDS,
  INIT_SLOT_MESSAGE,
  INIT_SCREEN_MESSAGE,
  DISPLAY_CARDS,
  VALID_CASH,
  DISPLAY_CASH,
} from "../../constants/vending";
import Button from "../common/Button";

export default function VendingMachine() {
  const [drinks, setDrinks] = useState(DRINKS);
  const [selectedDrink, setSelectedDrink] = useState<{
    name: string;
    price: number;
    emoji: any;
  } | null>(null);
  const [screenMessage, setScreenMessage] = useState(INIT_SCREEN_MESSAGE);
  const [slotMessage, setSlotMessage] = useState(INIT_SLOT_MESSAGE);
  const [step, setStep] = useState<
    "drink" | "payment-type" | "card" | "cash" | "dispensing"
  >("drink");
  const [insertedCash, setInsertedCash] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // 음료 선택
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

  // 재고 업데이트
  const updateDrinkStock = (drinkName: string) => {
    setDrinks((prev) =>
      prev.map((drink) =>
        drink.name === drinkName ? { ...drink, stock: drink.stock - 1 } : drink
      )
    );
  };

  // 카드 결제
  const payWithCard = (card: string) => {
    if (!VALID_CARDS.includes(card)) {
      setScreenMessage(`'${card}' 카드는 사용 불가합니다`);
      return;
    }

    setScreenMessage(`${card} 카드로 '${selectedDrink?.name}' 결제 완료!`);
    setSlotMessage(`${selectedDrink?.name} 나오는 중...`);
    setIsProcessing(true);
    if (selectedDrink) updateDrinkStock(selectedDrink.name);
    finishDispensing();
  };

  // 현금 결제
  const addCash = (amount: number) => {
    if (!VALID_CASH.includes(amount)) {
      setScreenMessage(`'${amount}'원은 사용 불가합니다`);
      return;
    }

    const newTotal = insertedCash + amount;
    setInsertedCash(newTotal);

    if (selectedDrink && newTotal >= selectedDrink.price) {
      payWithCash(newTotal);
    } else {
      setScreenMessage(
        `현금 ${newTotal.toLocaleString()}원 투입됨. ${selectedDrink?.price.toLocaleString()}원 필요`
      );
    }
  };

  const payWithCash = (newTotal: number) => {
    if (!selectedDrink) return;
    const change = newTotal - selectedDrink.price;

    let message = `현금 ${newTotal.toLocaleString()}원 결제 완료!`;
    if (change > 0) {
      message += ` 거스름돈 ${change.toLocaleString()}원 반환`;
    }

    setScreenMessage(message);
    setSlotMessage(`${selectedDrink.name} 나오는 중...`);
    setIsProcessing(true);
    if (selectedDrink) updateDrinkStock(selectedDrink.name);

    finishDispensing();
  };

  const finishDispensing = () => {
    setTimeout(() => {
      setStep("dispensing");
      setIsProcessing(false);
      setSlotMessage("맛있게 드세요");
      resetMachine();
    }, 3000);
  };

  const resetMachine = () => {
    setTimeout(() => {
      setScreenMessage(INIT_SCREEN_MESSAGE);
      setSlotMessage(INIT_SLOT_MESSAGE);
      setSelectedDrink(null);
      setInsertedCash(0);
      setStep("drink");
    }, 3000);
  };

  return (
    <div>
      <div className="vending-machine">
        <div className="screen">{screenMessage}</div>

        {step === "drink" && (
          <div className="buttons">
            {drinks.map((drink) => (
              <Button
                key={drink.name}
                className="drink-btn"
                onClick={() => selectDrink(drink.name)}
                disabled={drink.stock <= 0}
                style={{ opacity: drink.stock <= 0 ? 0.5 : 1 }}
              >
                {drink.name} <span>{drink.price.toLocaleString()}원</span>
                <div style={{ fontSize: "0.8em" }}>재고: {drink.stock}</div>
              </Button>
            ))}
          </div>
        )}

        {step === "payment-type" && (
          <div className="payment-section">
            <Button className="payment-btn" onClick={() => setStep("card")}>
              카드 결제
            </Button>
            <Button className="payment-btn" onClick={() => setStep("cash")}>
              현금 결제
            </Button>
          </div>
        )}

        {step === "card" && (
          <div className="payment-section">
            <div>카드 종류 선택:</div>
            {DISPLAY_CARDS.map((card) => (
              <Button
                key={card}
                disabled={isProcessing}
                className="payment-btn"
                onClick={() => payWithCard(card)}
              >
                {card} 카드
              </Button>
            ))}
          </div>
        )}

        {step === "cash" && (
          <div className="payment-section">
            <div>현금 투입:</div>
            <div className="payment-cash-section">
              {DISPLAY_CASH.map((amount) => (
                <Button
                  key={amount}
                  className="payment-btn"
                  disabled={isProcessing}
                  onClick={() => addCash(amount)}
                >
                  {amount.toLocaleString()}원
                </Button>
              ))}
            </div>
            <div>누적 투입 금액: {insertedCash.toLocaleString()}원</div>
          </div>
        )}

        {step === "dispensing" && (
          <div className="dispensing-section">
            <div>
              선택하신 {selectedDrink?.name}
              {selectedDrink?.emoji} 나왔습니다
            </div>
          </div>
        )}

        <div className="slot">{slotMessage}</div>
      </div>
    </div>
  );
}
