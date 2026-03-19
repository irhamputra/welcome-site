import { useState, useCallback, useRef, useEffect } from "react";
import { useWindowManager } from "../../../context/windowManager";

const CARD_W = 64;
const CARD_H = 90;
const PADDING = 8;
const COL_GAP = 8;
const FACE_DOWN_OFF = 18;
const FACE_UP_OFF = 26;

const SUIT_NAMES = ["spades", "hearts", "diamonds", "clubs"];
const SUIT_SYMBOLS = { spades: "♠", hearts: "♥", diamonds: "♦", clubs: "♣" };
const VALUE_LABELS = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const isRed = (s) => s === "hearts" || s === "diamonds";

function createDeck() {
  return SUIT_NAMES.flatMap((suit) =>
    Array.from({ length: 13 }, (_, i) => ({ suit, value: i + 1 }))
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initGame() {
  const deck = shuffle(createDeck());
  const tableau = Array.from({ length: 7 }, () => []);
  let idx = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      tableau[col].push({ ...deck[idx++], faceUp: row === col });
    }
  }
  return {
    stock: deck.slice(28).map((c) => ({ ...c, faceUp: false })),
    waste: [],
    foundations: [[], [], [], []],
    tableau,
    gameWon: false,
    score: 0,
  };
}

function canPlaceOnTableau(card, col) {
  if (col.length === 0) return card.value === 13;
  const top = col[col.length - 1];
  return top.faceUp && isRed(top.suit) !== isRed(card.suit) && top.value === card.value + 1;
}

function canPlaceOnFoundation(card, foundation) {
  if (foundation.length === 0) return card.value === 1;
  const top = foundation[foundation.length - 1];
  return top.suit === card.suit && top.value === card.value - 1;
}

function isGameWon(foundations) {
  return foundations.every((f) => f.length === 13);
}

function getSelectedCards(game, selected) {
  if (!selected) return null;
  if (selected.source === "waste") {
    return game.waste.length > 0 ? [game.waste[game.waste.length - 1]] : null;
  }
  if (selected.source === "tableau") {
    return game.tableau[selected.colIdx].slice(selected.cardIdx);
  }
  if (selected.source === "foundation") {
    const f = game.foundations[selected.foundIdx];
    return f.length > 0 ? [f[f.length - 1]] : null;
  }
  return null;
}

export default function SolitaireWindow() {
  const { updateSize } = useWindowManager();
  const [game, setGame] = useState(initGame);
  const [selected, setSelected] = useState(null);
  const [drawCount, setDrawCount] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const WIN_W = 7 * CARD_W + 6 * COL_GAP + 2 * PADDING + 2;

  useEffect(() => {
    updateSize("solitaire", WIN_W, 540);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const newGame = useCallback(
    (dc) => {
      const count = dc !== undefined ? dc : drawCount;
      setGame(initGame());
      setSelected(null);
      setMenuOpen(false);
      if (dc !== undefined) setDrawCount(dc);
    },
    [drawCount]
  );

  const performMove = useCallback(
    (dest, sel) => {
      const activeSel = sel || selected;
      const cards = getSelectedCards(game, activeSel);
      if (!cards || cards.length === 0) return false;

      setGame((g) => {
        let newWaste = [...g.waste];
        let newTableau = g.tableau.map((c) => [...c]);
        let newFoundations = g.foundations.map((f) => [...f]);
        let scoreIncrease = 0;

        if (activeSel.source === "waste") {
          newWaste = g.waste.slice(0, -1);
          if (dest.to === "tableau") scoreIncrease += 5;
        } else if (activeSel.source === "tableau") {
          newTableau[activeSel.colIdx] = newTableau[activeSel.colIdx].slice(0, activeSel.cardIdx);
          if (newTableau[activeSel.colIdx].length > 0) {
            const last = newTableau[activeSel.colIdx].length - 1;
            if (!newTableau[activeSel.colIdx][last].faceUp) {
              newTableau[activeSel.colIdx][last] = { ...newTableau[activeSel.colIdx][last], faceUp: true };
              scoreIncrease += 5;
            }
          }
          if (dest.to === "tableau") scoreIncrease += 3;
        } else if (activeSel.source === "foundation") {
          newFoundations[activeSel.foundIdx] = newFoundations[activeSel.foundIdx].slice(0, -1);
          scoreIncrease -= 15;
        }

        if (dest.to === "tableau") {
          newTableau[dest.colIdx] = [...newTableau[dest.colIdx], ...cards];
        } else if (dest.to === "foundation") {
          newFoundations[dest.foundIdx] = [...newFoundations[dest.foundIdx], ...cards];
          scoreIncrease += 10;
        }

        const ng = {
          ...g,
          waste: newWaste,
          tableau: newTableau,
          foundations: newFoundations,
          score: Math.max(0, g.score + scoreIncrease),
        };
        if (isGameWon(newFoundations)) ng.gameWon = true;
        return ng;
      });
      setSelected(null);
      return true;
    },
    [game, selected]
  );

  const autoMoveToFoundation = useCallback(
    (card, sel) => {
      for (let fi = 0; fi < 4; fi++) {
        if (canPlaceOnFoundation(card, game.foundations[fi])) {
          performMove({ to: "foundation", foundIdx: fi }, sel);
          return true;
        }
      }
      return false;
    },
    [game.foundations, performMove]
  );

  const handleStockClick = useCallback(() => {
    setSelected(null);
    setGame((g) => {
      if (g.stock.length === 0) {
        return {
          ...g,
          stock: [...g.waste].reverse().map((c) => ({ ...c, faceUp: false })),
          waste: [],
          score: Math.max(0, g.score - 100),
        };
      }
      const count = Math.min(drawCount, g.stock.length);
      const drawn = g.stock.slice(-count).map((c) => ({ ...c, faceUp: true }));
      return {
        ...g,
        stock: g.stock.slice(0, g.stock.length - count),
        waste: [...g.waste, ...drawn],
      };
    });
  }, [drawCount]);

  const handleWasteClick = useCallback(() => {
    if (game.waste.length === 0) return;
    setSelected({ source: "waste" });
  }, [game.waste.length]);

  const handleWasteDoubleClick = useCallback(() => {
    if (game.waste.length === 0) return;
    const card = game.waste[game.waste.length - 1];
    autoMoveToFoundation(card, { source: "waste" });
  }, [game.waste, autoMoveToFoundation]);

  const handleFoundationClick = useCallback(
    (foundIdx) => {
      if (selected) {
        const cards = getSelectedCards(game, selected);
        if (cards && cards.length === 1 && canPlaceOnFoundation(cards[0], game.foundations[foundIdx])) {
          performMove({ to: "foundation", foundIdx });
          return;
        }
      }
      if (game.foundations[foundIdx].length > 0) {
        setSelected({ source: "foundation", foundIdx });
      } else {
        setSelected(null);
      }
    },
    [game, selected, performMove]
  );

  const handleTableauClick = useCallback(
    (colIdx, cardIdx) => {
      const col = game.tableau[colIdx];

      if (selected) {
        const cards = getSelectedCards(game, selected);
        const canPlace =
          cards &&
          canPlaceOnTableau(cards[0], col) &&
          !(selected.source === "tableau" && selected.colIdx === colIdx);

        if (canPlace) {
          performMove({ to: "tableau", colIdx });
          return;
        }
      }

      if (cardIdx == null) {
        setSelected(null);
        return;
      }

      const card = col[cardIdx];

      if (!card.faceUp) {
        if (cardIdx === col.length - 1) {
          setGame((g) => {
            const newTab = g.tableau.map((c) => [...c]);
            newTab[colIdx][cardIdx] = { ...newTab[colIdx][cardIdx], faceUp: true };
            return { ...g, tableau: newTab, score: g.score + 5 };
          });
        }
        setSelected(null);
        return;
      }

      if (selected?.source === "tableau" && selected.colIdx === colIdx && selected.cardIdx === cardIdx) {
        setSelected(null);
      } else {
        setSelected({ source: "tableau", colIdx, cardIdx });
      }
    },
    [game, selected, performMove]
  );

  const handleTableauDoubleClick = useCallback(
    (colIdx, cardIdx) => {
      const col = game.tableau[colIdx];
      if (cardIdx !== col.length - 1) return;
      const card = col[cardIdx];
      if (!card.faceUp) return;
      autoMoveToFoundation(card, { source: "tableau", colIdx, cardIdx });
    },
    [game.tableau, autoMoveToFoundation]
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#1a6b1a",
        userSelect: "none",
        fontFamily: "Tahoma, sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Menu bar */}
      <div
        ref={menuRef}
        style={{
          background: "#c0c0c0",
          borderBottom: "1px solid #808080",
          padding: "2px 4px",
          fontSize: 12,
          position: "relative",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
        }}
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
        <span style={{ marginLeft: "auto", marginRight: 8, color: "#333", fontSize: 12 }}>
          Score: {game.score}
        </span>

        {menuOpen && (
          <div
            style={{
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
            }}
          >
            <MenuItem label="New Game" onClick={() => newGame()} />
            <div style={{ height: 1, background: "#808080", margin: "2px 0" }} />
            <MenuCheckItem label="Draw 1" checked={drawCount === 1} onClick={() => newGame(1)} />
            <MenuCheckItem label="Draw 3" checked={drawCount === 3} onClick={() => newGame(3)} />
          </div>
        )}
      </div>

      {/* Game area */}
      <div style={{ flex: 1, overflow: "auto", padding: PADDING }}>
        {/* Top row */}
        <div style={{ display: "flex", gap: COL_GAP, marginBottom: PADDING, alignItems: "flex-start" }}>
          {/* Stock */}
          <div
            onClick={handleStockClick}
            style={{
              width: CARD_W,
              height: CARD_H,
              cursor: "pointer",
              border: "2px dashed rgba(255,255,255,0.4)",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxSizing: "border-box",
            }}
          >
            {game.stock.length > 0 ? (
              <CardBack width={CARD_W} height={CARD_H} />
            ) : (
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 24, lineHeight: 1 }}>↺</div>
            )}
          </div>

          {/* Waste */}
          <div
            onClick={handleWasteClick}
            onDoubleClick={handleWasteDoubleClick}
            style={{
              width: drawCount === 3 && game.waste.length > 2 ? CARD_W + 12 : CARD_W,
              height: CARD_H,
              position: "relative",
              flexShrink: 0,
              cursor: game.waste.length > 0 ? "pointer" : "default",
            }}
          >
            {game.waste.length === 0 ? (
              <div
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  border: "2px dashed rgba(255,255,255,0.4)",
                  borderRadius: 4,
                  boxSizing: "border-box",
                }}
              />
            ) : drawCount === 3 && game.waste.length > 1 ? (
              <>
                {game.waste.length >= 3 && (
                  <div style={{ position: "absolute", left: 0, top: 0 }}>
                    <CardFace
                      card={game.waste[game.waste.length - 3]}
                      width={CARD_W}
                      height={CARD_H}
                      selected={false}
                    />
                  </div>
                )}
                {game.waste.length >= 2 && (
                  <div style={{ position: "absolute", left: game.waste.length >= 3 ? 6 : 0, top: 0 }}>
                    <CardFace
                      card={game.waste[game.waste.length - 2]}
                      width={CARD_W}
                      height={CARD_H}
                      selected={false}
                    />
                  </div>
                )}
                <div
                  style={{
                    position: "absolute",
                    left: game.waste.length >= 3 ? 12 : 6,
                    top: 0,
                  }}
                >
                  <CardFace
                    card={game.waste[game.waste.length - 1]}
                    width={CARD_W}
                    height={CARD_H}
                    selected={selected?.source === "waste"}
                  />
                </div>
              </>
            ) : (
              <CardFace
                card={game.waste[game.waste.length - 1]}
                width={CARD_W}
                height={CARD_H}
                selected={selected?.source === "waste"}
              />
            )}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Foundations */}
          {game.foundations.map((f, fi) => (
            <div
              key={fi}
              onClick={() => handleFoundationClick(fi)}
              style={{
                width: CARD_W,
                height: CARD_H,
                border: "2px dashed rgba(255,255,255,0.4)",
                borderRadius: 4,
                cursor: "pointer",
                position: "relative",
                flexShrink: 0,
                boxSizing: "border-box",
              }}
            >
              {f.length === 0 ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isRed(SUIT_NAMES[fi]) ? "rgba(255,150,150,0.6)" : "rgba(255,255,255,0.4)",
                    fontSize: 24,
                  }}
                >
                  {SUIT_SYMBOLS[SUIT_NAMES[fi]]}
                </div>
              ) : (
                <CardFace
                  card={f[f.length - 1]}
                  width={CARD_W}
                  height={CARD_H}
                  selected={selected?.source === "foundation" && selected.foundIdx === fi}
                />
              )}
            </div>
          ))}
        </div>

        {/* Tableau */}
        <div style={{ display: "flex", gap: COL_GAP }}>
          {game.tableau.map((col, colIdx) => (
            <TableauColumn
              key={colIdx}
              col={col}
              colIdx={colIdx}
              selected={selected}
              onClick={(cardIdx) => handleTableauClick(colIdx, cardIdx)}
              onDoubleClick={(cardIdx) => handleTableauDoubleClick(colIdx, cardIdx)}
            />
          ))}
        </div>
      </div>

      {/* Win overlay */}
      {game.gameWon && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "#c0c0c0",
              border: "2px solid",
              borderColor: "#ffffff #808080 #808080 #ffffff",
              padding: "20px 36px",
              textAlign: "center",
              boxShadow: "4px 4px 0 rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 6 }}>
              You Win! 🎉
            </div>
            <div style={{ fontSize: 13, marginBottom: 16, color: "#333" }}>
              Score: {game.score}
            </div>
            <button
              onClick={() => newGame()}
              style={{
                padding: "4px 20px",
                background: "#c0c0c0",
                border: "2px solid",
                borderColor: "#ffffff #808080 #808080 #ffffff",
                cursor: "pointer",
                fontFamily: "Tahoma, sans-serif",
                fontSize: 13,
              }}
            >
              New Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TableauColumn({ col, colIdx, selected, onClick, onDoubleClick }) {
  let totalH = CARD_H;
  if (col.length > 1) {
    totalH = 0;
    for (let i = 0; i < col.length - 1; i++) {
      totalH += col[i].faceUp ? FACE_UP_OFF : FACE_DOWN_OFF;
    }
    totalH += CARD_H;
  }

  return (
    <div
      style={{
        width: CARD_W,
        minHeight: CARD_H,
        height: totalH,
        position: "relative",
        flexShrink: 0,
      }}
      onClick={() => onClick(null)}
    >
      {col.length === 0 && (
        <div
          style={{
            width: CARD_W,
            height: CARD_H,
            border: "2px dashed rgba(255,255,255,0.3)",
            borderRadius: 4,
            boxSizing: "border-box",
          }}
        />
      )}
      {col.map((card, i) => {
        let top = 0;
        for (let j = 0; j < i; j++) {
          top += col[j].faceUp ? FACE_UP_OFF : FACE_DOWN_OFF;
        }
        const isSelectedCard =
          selected?.source === "tableau" &&
          selected.colIdx === colIdx &&
          i >= selected.cardIdx;

        return (
          <div
            key={i}
            style={{ position: "absolute", top, left: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              onClick(i);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onDoubleClick(i);
            }}
          >
            {card.faceUp ? (
              <CardFace card={card} width={CARD_W} height={CARD_H} selected={isSelectedCard} />
            ) : (
              <CardBack width={CARD_W} height={CARD_H} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CardFace({ card, width, height, selected }) {
  const color = isRed(card.suit) ? "#cc0000" : "#111111";
  const sym = SUIT_SYMBOLS[card.suit];
  const lbl = VALUE_LABELS[card.value];

  return (
    <div
      style={{
        width,
        height,
        background: selected ? "#ddeeff" : "white",
        border: selected ? "2px solid #316ac5" : "1px solid #aaa",
        borderRadius: 3,
        position: "relative",
        boxSizing: "border-box",
        overflow: "hidden",
        boxShadow: "1px 1px 2px rgba(0,0,0,0.25)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: 3,
          color,
          fontSize: 11,
          lineHeight: 1.1,
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div>{lbl}</div>
        <div style={{ fontSize: 10 }}>{sym}</div>
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color,
          fontSize: 24,
          lineHeight: 1,
        }}
      >
        {sym}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 2,
          right: 3,
          color,
          fontSize: 11,
          lineHeight: 1.1,
          fontWeight: "bold",
          transform: "rotate(180deg)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div>{lbl}</div>
        <div style={{ fontSize: 10 }}>{sym}</div>
      </div>
    </div>
  );
}

function CardBack({ width, height }) {
  return (
    <div
      style={{
        width,
        height,
        background:
          "repeating-linear-gradient(45deg, #1a4fc4 0px, #1a4fc4 4px, #2561e8 4px, #2561e8 8px)",
        border: "1px solid #0a2f8a",
        borderRadius: 3,
        boxSizing: "border-box",
        boxShadow: "1px 1px 2px rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: width - 10,
          height: height - 10,
          border: "2px solid rgba(255,255,255,0.35)",
          borderRadius: 2,
        }}
      />
    </div>
  );
}

function MenuItem({ label, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "3px 20px",
        fontSize: 12,
        cursor: "default",
        background: hover ? "#316ac5" : "transparent",
        color: hover ? "white" : "black",
      }}
    >
      {label}
    </div>
  );
}

function MenuCheckItem({ label, checked, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "3px 20px 3px 8px",
        fontSize: 12,
        cursor: "default",
        display: "flex",
        alignItems: "center",
        gap: 4,
        background: hover ? "#316ac5" : "transparent",
        color: hover ? "white" : "black",
      }}
    >
      <span style={{ width: 12, textAlign: "center", fontSize: 10 }}>{checked ? "✓" : ""}</span>
      {label}
    </div>
  );
}
