// calc.js
function VirtualKeyboard({ onSymbolClick }) {
  const symbols = ["1", "2", "3", "8", "9", "+", "(", ")", "A", "B"];
  return (
    <div className="keyboard">
      {symbols.map((sym, index) => (
        <div key={index} className="key" onClick={() => onSymbolClick(sym)}>
          {sym}
        </div>
      ))}
    </div>
  );
}

function Calculator() {
  const [input, setInput] = React.useState("");
  const addSymbol = (symbol) => {
    setInput((prev) => prev + symbol);
  };
  const handlePaste = (e) => {
    e.preventDefault();
    alert("Paste is disabled in this field.");
  };
  const handleChange = (e) => {
    setInput(e.target.value);
  };
  return (
    <div>
      <h2>Calculator</h2>
      <textarea
        id="inputField"
        rows="2"
        value={input}
        onChange={handleChange}
        onPaste={handlePaste}
        placeholder="Alusta kirjutamist..."
      ></textarea>
      <VirtualKeyboard onSymbolClick={addSymbol} />
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Keemia Kalkulaator ja Joonistamine</h1>
      <Calculator />
      <hr style={{ margin: "40px 0" }} />
      <DrawingTool />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
