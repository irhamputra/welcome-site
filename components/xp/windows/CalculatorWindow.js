import { useState, useEffect, useCallback } from "react";

export default function CalculatorWindow() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);

  const inputDigit = useCallback((d) => {
    if (waitingForOperand) { setDisplay(String(d)); setWaitingForOperand(false); }
    else setDisplay(display === "0" ? String(d) : display.length < 16 ? display + d : display);
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) { setDisplay("0."); setWaitingForOperand(false); return; }
    if (!display.includes(".")) setDisplay(display + ".");
  }, [display, waitingForOperand]);

  const handleOp = useCallback((nextOp) => {
    const val = parseFloat(display);
    if (prev !== null && !waitingForOperand) {
      const result = calculate(prev, val, op);
      setDisplay(formatNum(result));
      setPrev(result);
    } else {
      setPrev(val);
    }
    setOp(nextOp);
    setWaitingForOperand(true);
  }, [display, prev, op, waitingForOperand]);

  const handleEquals = useCallback(() => {
    if (op === null || prev === null) return;
    const result = calculate(prev, parseFloat(display), op);
    setDisplay(formatNum(result));
    setPrev(null); setOp(null); setWaitingForOperand(true);
  }, [display, prev, op]);

  const handleClear     = useCallback(() => { setDisplay("0"); setPrev(null); setOp(null); setWaitingForOperand(false); }, []);
  const handleCE        = useCallback(() => { setDisplay("0"); setWaitingForOperand(false); }, []);
  const handleBackspace = useCallback(() => {
    if (waitingForOperand) return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
  }, [display, waitingForOperand]);
  const handleToggleSign = useCallback(() => {
    const v = parseFloat(display);
    if (v !== 0) setDisplay(formatNum(-v));
  }, [display]);
  const handleSqrt = useCallback(() => {
    const v = parseFloat(display);
    setDisplay(v < 0 ? "Error" : formatNum(Math.sqrt(v)));
    setWaitingForOperand(true);
  }, [display]);
  const handlePercent = useCallback(() => {
    if (prev !== null) setDisplay(formatNum(prev * parseFloat(display) / 100));
    else setDisplay("0");
    setWaitingForOperand(true);
  }, [display, prev]);
  const handleReciprocal = useCallback(() => {
    const v = parseFloat(display);
    setDisplay(v === 0 ? "Error" : formatNum(1 / v));
    setWaitingForOperand(true);
  }, [display]);

  const handleMemory = useCallback((cmd) => {
    const val = parseFloat(display);
    if (cmd === "MC") setMemory(0);
    else if (cmd === "MR") { setDisplay(formatNum(memory)); setWaitingForOperand(true); }
    else if (cmd === "MS") setMemory(val);
    else if (cmd === "M+") setMemory(memory + val);
  }, [display, memory]);

  const handleBtn = useCallback((btn) => {
    if (/^[0-9]$/.test(btn))              inputDigit(btn);
    else if (btn === ".")                  inputDecimal();
    else if (["+","-","*","/"].includes(btn)) handleOp(btn);
    else if (btn === "=")                  handleEquals();
    else if (btn === "C")                  handleClear();
    else if (btn === "CE")                 handleCE();
    else if (btn === "Back")               handleBackspace();
    else if (btn === "+/-")                handleToggleSign();
    else if (btn === "sqrt")               handleSqrt();
    else if (btn === "%")                  handlePercent();
    else if (btn === "1/x")                handleReciprocal();
    else if (["MC","MR","MS","M+"].includes(btn)) handleMemory(btn);
  }, [inputDigit, inputDecimal, handleOp, handleEquals, handleClear, handleCE, handleBackspace, handleToggleSign, handleSqrt, handlePercent, handleReciprocal, handleMemory]);

  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const k = e.key;
      if (/^[0-9]$/.test(k))                handleBtn(k);
      else if (k === ".")                    handleBtn(".");
      else if (["+","-","*","/"].includes(k)) handleBtn(k);
      else if (k === "Enter" || k === "=")   handleBtn("=");
      else if (k === "Backspace")            handleBtn("Back");
      else if (k === "Escape")               handleBtn("C");
      else if (k === "%")                    handleBtn("%");
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [handleBtn]);

  const fontSize = display.length > 14 ? 13 : display.length > 10 ? 16 : 20;

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "#d4d0c8", fontFamily: "Tahoma, Arial, sans-serif",
      userSelect: "none", overflow: "hidden",
    }}>
      {/* Menu bar */}
      <div style={{ display: "flex", background: "#f1efe2", borderBottom: "1px solid #aca899", padding: "1px 4px", fontSize: 12, gap: 0, flexShrink: 0 }}>
        {["View", "Edit", "Help"].map(m => (
          <div key={m} style={{ padding: "2px 8px", cursor: "default" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#316ac5"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = ""; }}
          >{m}</div>
        ))}
      </div>

      {/* Body */}
      <div style={{ padding: "6px 5px 5px", display: "flex", flexDirection: "column", gap: 4 }}>

        {/* Display */}
        <div style={{ position: "relative", marginBottom: 2 }}>
          <div style={{
            background: "white",
            border: "2px solid", borderColor: "#808080 #fff #fff #808080",
            outline: "1px solid #000",
            padding: "2px 8px 2px 4px",
            textAlign: "right",
            fontSize,
            fontFamily: "Tahoma, sans-serif",
            height: 32, lineHeight: "28px",
            overflow: "hidden", whiteSpace: "nowrap",
            color: "#000",
          }}>
            {display}
          </div>
          {/* Memory indicator */}
          {memory !== 0 && (
            <div style={{ position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "#555" }}>M</div>
          )}
        </div>

        {/* Backspace / CE / C row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
          <Btn label="Backspace" bg="btnSpec" onClick={() => handleBtn("Back")} />
          <Btn label="CE"        bg="btnSpec" onClick={() => handleBtn("CE")} />
          <Btn label="C"         bg="btnSpec" onClick={() => handleBtn("C")} />
        </div>

        {/* Main grid: 5 rows × 6 cols, = spans rows 4-5 in col 6 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridTemplateRows: "repeat(5, 28px)",
          gap: 4,
        }}>
          {/* Row 1: MC 7 8 9 / sqrt */}
          <Btn label="MC"   bg="btnMem"  onClick={() => handleBtn("MC")} />
          <Btn label="7"    bg="btnNum"  onClick={() => handleBtn("7")} />
          <Btn label="8"    bg="btnNum"  onClick={() => handleBtn("8")} />
          <Btn label="9"    bg="btnNum"  onClick={() => handleBtn("9")} />
          <Btn label="/"    bg="btnOp"   onClick={() => handleBtn("/")} />
          <Btn label="sqrt" bg="btnOp"   onClick={() => handleBtn("sqrt")} />

          {/* Row 2: MR 4 5 6 * % */}
          <Btn label="MR"   bg="btnMem"  onClick={() => handleBtn("MR")} />
          <Btn label="4"    bg="btnNum"  onClick={() => handleBtn("4")} />
          <Btn label="5"    bg="btnNum"  onClick={() => handleBtn("5")} />
          <Btn label="6"    bg="btnNum"  onClick={() => handleBtn("6")} />
          <Btn label="*"    bg="btnOp"   onClick={() => handleBtn("*")} />
          <Btn label="%"    bg="btnOp"   onClick={() => handleBtn("%")} />

          {/* Row 3: MS 1 2 3 - 1/x */}
          <Btn label="MS"   bg="btnMem"  onClick={() => handleBtn("MS")} />
          <Btn label="1"    bg="btnNum"  onClick={() => handleBtn("1")} />
          <Btn label="2"    bg="btnNum"  onClick={() => handleBtn("2")} />
          <Btn label="3"    bg="btnNum"  onClick={() => handleBtn("3")} />
          <Btn label="-"    bg="btnOp"   onClick={() => handleBtn("-")} />
          <Btn label="1/x"  bg="btnOp"   onClick={() => handleBtn("1/x")} />

          {/* Row 4: M+ 0 +/- . + [= row1] */}
          <Btn label="M+"   bg="btnMem"  onClick={() => handleBtn("M+")} />
          <Btn label="0"    bg="btnNum"  onClick={() => handleBtn("0")} />
          <Btn label="+/-"  bg="btnNum"  onClick={() => handleBtn("+/-")} />
          <Btn label="."    bg="btnNum"  onClick={() => handleBtn(".")} />
          <Btn label="+"    bg="btnOp"   onClick={() => handleBtn("+")} />
          {/* = spans rows 4-5 */}
          <Btn label="=" bg="btnEq" onClick={() => handleBtn("=")}
            style={{ gridRow: "4 / 6" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Button styles ─────────────────────────────────── */
const BG = {
  btnNum:  { bg: "linear-gradient(180deg,#f0ece0 0%,#ddd8cc 100%)", border: "#888 #e0dcd0 #e0dcd0 #888", color: "#000" },
  btnOp:   { bg: "linear-gradient(180deg,#e8e0d0 0%,#d0c8b8 100%)", border: "#888 #dcd4c4 #dcd4c4 #888", color: "#000" },
  btnMem:  { bg: "linear-gradient(180deg,#d8cfc0 0%,#bfb8a8 100%)", border: "#888 #d0c8b8 #d0c8b8 #888", color: "#000" },
  btnSpec: { bg: "linear-gradient(180deg,#e0d8c8 0%,#c8c0b0 100%)", border: "#888 #d8d0c0 #d8d0c0 #888", color: "#400" },
  btnEq:   { bg: "linear-gradient(180deg,#e8e0d0 0%,#d0c8b8 100%)", border: "#888 #dcd4c4 #dcd4c4 #888", color: "#000" },
};

function Btn({ label, bg, onClick, style = {} }) {
  const s = BG[bg] || BG.btnNum;
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      style={{
        background: s.bg,
        border: "2px solid",
        borderColor: s.border,
        borderRadius: 2,
        cursor: "default",
        fontSize: label.length > 3 ? 10 : 12,
        fontFamily: "Tahoma, sans-serif",
        fontWeight: label === "=" ? "bold" : "normal",
        color: s.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 0,
        lineHeight: 1,
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.06)"}
      onMouseLeave={e => e.currentTarget.style.filter = ""}
      onMouseDown={e => { e.preventDefault(); e.currentTarget.style.borderColor = s.border.split(" ").reverse().join(" "); onClick(); }}
      onMouseUp={e => e.currentTarget.style.borderColor = s.border}
    >
      {label}
    </button>
  );
}

function calculate(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? NaN : a / b;
    default:  return b;
  }
}

function formatNum(n) {
  if (isNaN(n) || !isFinite(n)) return "Error";
  const s = String(n);
  return s.length > 16 ? parseFloat(n.toPrecision(12)).toString() : s;
}
