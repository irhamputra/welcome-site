import { useState, useEffect, useCallback, useRef } from "react";
import { useWindowManager } from "../../../context/windowManager";

const CELL = 20; // px per cell

// Content breakdown:
//   menu bar: ~24px (button ~18px + div padding 2*2=4px + border 1px)
//   game area border: 3px top + 3px bottom = 6px
//   game area padding: 6px top + 6px bottom = 12px
//   header bar: content(~32px) + padding(4*2=8px) + border(2*2=4px) + marginBottom(6px) = 50px
//   board: rows*CELL + border(3*2=6px)
//   window title bar consumed by calc(100% - 28px): 28px
function levelWindowSize(rows, cols) {
  const boardW = cols * CELL + 6;
  const boardH = rows * CELL + 6;
  const contentW = boardW + 18 + 8;        // board + game-area(pad+border) + outer
  const contentH = 24 + 50 + boardH + 18; // menu + header + board + game-area(pad+border)
  return { width: contentW, height: contentH + 28 };
}

const LEVELS = {
  beginner:     { label: "Beginner",     rows: 9,  cols: 9,  mines: 10 },
  intermediate: { label: "Intermediate", rows: 16, cols: 16, mines: 40 },
  expert:       { label: "Expert",       rows: 16, cols: 30, mines: 99 },
};

function createEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );
}

function placeMines(board, rows, cols, mines, firstRow, firstCol) {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!newBoard[r][c].isMine && !(r === firstRow && c === firstCol)) {
      newBoard[r][c].isMine = true;
      placed++;
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!newBoard[r][c].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
              count++;
            }
          }
        }
        newBoard[r][c].adjacentMines = count;
      }
    }
  }
  return newBoard;
}

function revealCells(board, rows, cols, row, col) {
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));
  const stack = [[row, col]];
  while (stack.length > 0) {
    const [r, c] = stack.pop();
    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
    if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) continue;
    newBoard[r][c].isRevealed = true;
    if (newBoard[r][c].adjacentMines === 0 && !newBoard[r][c].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          stack.push([r + dr, c + dc]);
        }
      }
    }
  }
  return newBoard;
}

const MINE_COLORS = ["", "#0000ff", "#008000", "#ff0000", "#000080", "#800000", "#008080", "#000000", "#808080"];

export default function MinesweeperWindow() {
  const { updateSize } = useWindowManager();
  const [levelKey, setLevelKey] = useState("beginner");
  const level = LEVELS[levelKey];

  // Set correct window size for initial level on mount
  useEffect(() => {
    const { width, height } = levelWindowSize(level.rows, level.cols);
    updateSize("minesweeper", width, height);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [board, setBoard] = useState(() => createEmptyBoard(level.rows, level.cols));
  const [gameState, setGameState] = useState("idle");
  const [minesLeft, setMinesLeft] = useState(level.mines);
  const [time, setTime] = useState(0);
  const [pressing, setPressing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => setTime((t) => Math.min(t + 1, 999)), 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  const startLevel = useCallback((key) => {
    const l = LEVELS[key];
    const { width, height } = levelWindowSize(l.rows, l.cols);
    updateSize("minesweeper", width, height);
    setLevelKey(key);
    setBoard(createEmptyBoard(l.rows, l.cols));
    setGameState("idle");
    setMinesLeft(l.mines);
    setTime(0);
    setMenuOpen(false);
  }, [updateSize]);

  const reset = useCallback(() => {
    setBoard(createEmptyBoard(level.rows, level.cols));
    setGameState("idle");
    setMinesLeft(level.mines);
    setTime(0);
  }, [level]);

  const checkWin = useCallback((b, rows, cols) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!b[r][c].isMine && !b[r][c].isRevealed) return false;
      }
    }
    return true;
  }, []);

  const handleLeftClick = useCallback((row, col) => {
    if (gameState === "won" || gameState === "lost") return;
    const cell = board[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    let currentBoard = board;
    let currentState = gameState;

    if (currentState === "idle") {
      currentBoard = placeMines(board, level.rows, level.cols, level.mines, row, col);
      currentState = "playing";
      setGameState("playing");
    }

    if (currentBoard[row][col].isMine) {
      const newBoard = currentBoard.map((r) =>
        r.map((c) => ({ ...c, isRevealed: c.isMine ? true : c.isRevealed }))
      );
      setBoard(newBoard);
      setGameState("lost");
      return;
    }

    const newBoard = revealCells(currentBoard, level.rows, level.cols, row, col);
    setBoard(newBoard);
    if (checkWin(newBoard, level.rows, level.cols)) {
      setGameState("won");
    }
  }, [board, gameState, level, checkWin]);

  const handleRightClick = useCallback((e, row, col) => {
    e.preventDefault();
    if (gameState === "won" || gameState === "lost" || gameState === "idle") return;
    const cell = board[row][col];
    if (cell.isRevealed) return;
    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
    setMinesLeft((m) => m + (cell.isFlagged ? 1 : -1));
  }, [board, gameState]);

  const face = gameState === "won" ? "😎" : gameState === "lost" ? "😵" : pressing ? "😮" : "🙂";
  const pad = (n) => String(Math.max(0, Math.min(999, n))).padStart(3, "0");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#c0c0c0",
        overflow: "hidden",
        userSelect: "none",
        fontFamily: "Tahoma, sans-serif",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Menu bar */}
      <div
        style={{
          background: "#c0c0c0",
          borderBottom: "1px solid #808080",
          padding: "2px 4px",
          fontSize: 12,
          position: "relative",
        }}
        ref={menuRef}
      >
        <button
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            background: menuOpen ? "#316ac5" : "transparent",
            color: menuOpen ? "white" : "black",
            border: "none",
            padding: "1px 6px",
            cursor: "default",
            fontSize: 12,
            fontFamily: "Tahoma, sans-serif",
          }}
        >
          Game
        </button>

        {menuOpen && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "#c0c0c0",
            border: "1px solid",
            borderColor: "#ffffff #808080 #808080 #ffffff",
            boxShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            zIndex: 100,
            minWidth: 160,
            padding: "2px 0",
          }}>
            <MenuDividerItem label="New" onClick={reset} />
            <div style={{ height: 1, background: "#808080", margin: "2px 0" }} />
            {Object.entries(LEVELS).map(([key, l]) => (
              <MenuCheckItem
                key={key}
                label={`${l.label}  (${l.cols}×${l.rows}, ${l.mines} mines)`}
                checked={levelKey === key}
                onClick={() => startLevel(key)}
              />
            ))}
            <div style={{ height: 1, background: "#808080", margin: "2px 0" }} />
            <MenuDividerItem label="Exit" onClick={() => setMenuOpen(false)} />
          </div>
        )}
      </div>

      {/* Game area */}
      <div style={{ padding: 6, border: "3px solid", borderColor: "#ffffff #808080 #808080 #ffffff" }}>
        {/* Header bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "4px 6px",
          marginBottom: 6,
          background: "#c0c0c0",
          border: "2px solid",
          borderColor: "#808080 #ffffff #ffffff #808080",
        }}>
          <div style={{
            background: "#000", color: "#ff0000",
            fontFamily: "'Courier New', monospace", fontSize: 20, fontWeight: "bold",
            padding: "2px 4px", minWidth: 42, textAlign: "center",
            letterSpacing: 2, border: "2px inset #808080",
          }}>
            {pad(minesLeft)}
          </div>

          <button
            onClick={reset}
            onMouseDown={() => setPressing(true)}
            onMouseUp={() => setPressing(false)}
            onMouseLeave={() => setPressing(false)}
            style={{
              fontSize: 18, background: "#c0c0c0",
              border: "2px solid", borderColor: "#ffffff #808080 #808080 #ffffff",
              width: 28, height: 28, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
            }}
          >
            {face}
          </button>

          <div style={{
            background: "#000", color: "#ff0000",
            fontFamily: "'Courier New', monospace", fontSize: 20, fontWeight: "bold",
            padding: "2px 4px", minWidth: 42, textAlign: "center",
            letterSpacing: 2, border: "2px inset #808080",
          }}>
            {pad(time)}
          </div>
        </div>

        {/* Board */}
        <div style={{ border: "3px solid", borderColor: "#808080 #ffffff #ffffff #808080" }}>
          {board.map((row, r) => (
            <div key={r} style={{ display: "flex" }}>
              {row.map((cell, c) => (
                <Cell
                  key={c}
                  cell={cell}
                  isLost={gameState === "lost"}
                  onLeftClick={() => handleLeftClick(r, c)}
                  onRightClick={(e) => handleRightClick(e, r, c)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuDividerItem({ label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ padding: "3px 20px", fontSize: 12, cursor: "default" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#316ac5"; e.currentTarget.style.color = "white"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = ""; }}
    >
      {label}
    </div>
  );
}

function MenuCheckItem({ label, checked, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ padding: "3px 20px 3px 8px", fontSize: 12, cursor: "default", display: "flex", alignItems: "center", gap: 4 }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#316ac5"; e.currentTarget.style.color = "white"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = ""; }}
    >
      <span style={{ width: 12, textAlign: "center", fontSize: 10 }}>{checked ? "✓" : ""}</span>
      {label}
    </div>
  );
}

function Cell({ cell, isLost, onLeftClick, onRightClick }) {
  const { isRevealed, isMine, isFlagged, adjacentMines } = cell;

  let content = null;
  let bg = "#c0c0c0";
  let border = "2px solid";
  let borderColor = "#ffffff #808080 #808080 #ffffff";

  if (isRevealed) {
    bg = "#c0c0c0";
    border = "1px solid #808080";
    borderColor = "#808080";
    if (isMine) {
      content = "💣";
      bg = isLost ? "#ff0000" : "#c0c0c0";
    } else if (adjacentMines > 0) {
      content = (
        <span style={{ color: MINE_COLORS[adjacentMines], fontWeight: "bold", fontSize: 11, fontFamily: "Arial, sans-serif" }}>
          {adjacentMines}
        </span>
      );
    }
  } else if (isFlagged) {
    content = "🚩";
  } else if (isLost && isMine) {
    content = "💣";
    border = "1px solid #808080";
    borderColor = "#808080";
  }

  return (
    <div
      onClick={onLeftClick}
      onContextMenu={onRightClick}
      style={{
        width: 20, height: 20, background: bg,
        border, borderColor,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "default", fontSize: 13, flexShrink: 0, boxSizing: "border-box",
      }}
    >
      {content}
    </div>
  );
}
