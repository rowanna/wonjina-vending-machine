import "./App.css";
import VendingMachine from "./components/VendingMachine/VendingMachine";

function App() {
  return (
    <>
      <h1 className="title">Vending Machine</h1>
      <VendingMachine />
      <button className="go-to-home">
        <a href="/">초기 상태로 돌아가기</a>
      </button>
    </>
  );
}

export default App;
