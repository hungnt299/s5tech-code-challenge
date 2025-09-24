import React, { useEffect, useMemo, useState } from "react";
import TokenModal from "./components/TokenModal.jsx";
import { ToastContainer, toast } from "react-toastify";
import { formatNumber } from "./helpers.js";
import _ from "lodash";

export default function App() {
  const [amountIn, setAmountIn] = useState("");
  const [symbolIn, setSymbolIn] = useState("USDC");
  const [symbolOut, setSymbolOut] = useState("ETH");
  const [prices, setPrices] = useState([]);
  const [modalSide, setModalSide] = useState(null); // 'in' | 'out' | null
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferError, setTransferError] = useState("");

  const notify = () => toast.success("Tokens swapped successfully!");

  const [balances, setBalances] = useState({
    ATOM: 1292,
    BUSD: 312,
    ETH: 3290,
    GMX: 8000,
    KUJI: 91,
    OKX: 1000,
    USDC: 1000,
    WBTC: 5500,
  });

  const balance = useMemo(() => balances[symbolIn] ?? 0, [balances, symbolIn]);
  const isSameToken = useMemo(
    () => symbolIn === symbolOut,
    [symbolIn, symbolOut]
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://interview.switcheo.com/prices.json");
        const data = await res.json();
        setPrices(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const priceIn = useMemo(
    () => _.find(prices, (p) => p.currency === symbolIn)?.price,
    [prices, symbolIn]
  );

  const priceOut = useMemo(
    () => _.find(prices, (p) => p.currency === symbolOut)?.price,
    [prices, symbolOut]
  );

  const rate = useMemo(
    () => (priceIn && priceOut ? priceIn / priceOut : undefined),
    [priceIn, priceOut]
  );

  const amountOut = useMemo(() => {
    const a = parseFloat(amountIn || "0");
    return rate ? a * rate : 0;
  }, [amountIn, rate]);

  const minReceived = useMemo(() => amountOut * (1 - 25 / 10000), [amountOut]);

  const amountInNum = useMemo(() => parseFloat(amountIn || "0"), [amountIn]);

  const isInsufficient = useMemo(
    () => amountIn !== "" && amountInNum > balance,
    [amountIn, amountInNum, balance]
  );

  const swapSides = () => {
    setSymbolIn(symbolOut);
    setSymbolOut(symbolIn);
  };

  // When switching input token, if no balance, set amount to 0 for clarity
  useEffect(() => {
    if ((balances?.[symbolIn] ?? 0) === 0) {
      setAmountIn("0");
    }
  }, [symbolIn, balances]);

  return (
    <div className="app">
      <header className="app-header">
        <nav className="tabs" role="tablist" aria-label="Swap type">
          <button
            className="tab active !py-1 !px-3"
            role="tab"
            aria-selected="true"
          >
            Swap
          </button>
        </nav>
        <div className="actions">
          <button className="icon-btn" aria-label="Settings">
            <i className="bx bx-cog"></i>
          </button>
          <button className="icon-btn" aria-label="Slippage">
            <i className="bx bx-dots-horizontal-rounded"></i>
          </button>
        </div>
      </header>

      <main>
        <section className="panel">
          <div className="panel-row">
            <div className="label-col">
              <span className="muted">You pay</span>
              <span className="balance text-sm">
                Balance:{" "}
                <span className="font-bold">{formatNumber(balance)}</span>
              </span>
            </div>
          </div>
          <div className="amount-row">
            <input
              inputMode="decimal"
              placeholder="0.00"
              aria-label="Amount to send"
              value={amountIn}
              aria-invalid={isInsufficient}
              onChange={(e) => {
                const value = e.target.value;
                // Clear transfer error when user changes input
                setTransferError("");
                // Allow empty string for clearing
                if (value === "") {
                  setAmountIn("");
                  return;
                }
                // Only allow numbers and decimal point
                if (!/^\d*\.?\d*$/.test(value)) {
                  return;
                }
                // Accept any numeric value; validation shown separately
                setAmountIn(value);
              }}
            />
            <button
              className="token-select"
              onClick={() => setModalSide("in")}
              aria-haspopup="listbox"
              aria-expanded={modalSide === "in"}
            >
              <img
                src={`/public/images/tokens/${symbolIn}.svg`}
                className="token-logo"
                aria-hidden="true"
              ></img>
              <span className="token-symbol">{symbolIn}</span>
              <span className="caret">
                <i className="bx bx-chevron-down"></i>
              </span>
            </button>
          </div>
          <div
            className="percent-row"
            role="group"
            aria-label="Quick percentages"
          >
            {[15, 25, 50, 75, 100].map((p) => (
              <button
                key={p}
                className="pct"
                onClick={() => setAmountIn(String((balance * p) / 100))}
              >
                {p}%
              </button>
            ))}
          </div>
          {isInsufficient && (
            <div className="mini text-red-500 mt-3" role="alert">
              Insufficient balance to transfer
            </div>
          )}
        </section>

        <button
          className="swap-divider"
          aria-label="Swap tokens"
          onClick={swapSides}
        >
          <i className="bx bx-transfer rotate-90"></i>
        </button>

        <section className="panel">
          <div className="panel-row">
            <div className="label-col">
              <span className="muted">You receive</span>
            </div>
          </div>
          <div className="amount-row">
            <input
              inputMode="decimal"
              placeholder="0.00"
              aria-label="Amount to receive"
              value={amountOut ? formatNumber(amountOut) : ""}
              readOnly
            />
            <button
              className="token-select"
              onClick={() => setModalSide("out")}
              aria-haspopup="listbox"
              aria-expanded={modalSide === "out"}
            >
              <img
                src={`/public/images/tokens/${symbolOut}.svg`}
                className="token-logo"
                aria-hidden="true"
              ></img>
              <span className="token-symbol">{symbolOut}</span>
              <span className="caret">
                <i className="bx bx-chevron-down"></i>
              </span>
            </button>
          </div>
          <div className="mini muted">
            Min. received: {formatNumber(minReceived)}
          </div>
        </section>

        <p className="rate muted">
          1 {symbolIn} = {rate ? formatNumber(rate) : "—"} {symbolOut}
        </p>

        <button
          className="primary hover:opacity-80 transition-all flex justify-center items-center"
          disabled={isTransferring || isInsufficient}
          onClick={() => {
            // Validate on transfer
            if (isSameToken) {
              setTransferError("Cannot transfer the same token!");
              return;
            }
            if (amountIn === "" || amountInNum <= 0) {
              setTransferError("Enter a valid amount greater than 0!");
              return;
            }
            if (isInsufficient) {
              setTransferError("Insufficient balance to transfer!");
              return;
            }
            setTransferError("");
            setIsTransferring(true);

            setTimeout(() => {
              // Update balances after successful transfer
              setBalances((prevBalances) => ({
                ...prevBalances,
                [symbolIn]: prevBalances[symbolIn] - amountInNum,
                [symbolOut]: prevBalances[symbolOut] + amountOut,
              }));

              // Clear the input amount after successful transfer
              setAmountIn("");

              setIsTransferring(false);
              notify();
            }, 1500);
          }}
        >
          {isTransferring ? (
            <span className="spinner" aria-label="Loading"></span>
          ) : (
            "Transfer"
          )}
        </button>

        {transferError && (
          <div className="mini text-red-500 mt-2 text-center" role="alert">
            {transferError}
          </div>
        )}
      </main>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <TokenModal
        open={!!modalSide}
        onClose={() => setModalSide(null)}
        prices={prices}
        balances={balances}
        excludeSymbol={modalSide === "out" ? symbolIn : undefined}
        onlyWithBalance={modalSide === "in"}
        activeSymbol={modalSide === "in" ? symbolIn : symbolOut}
        onSelect={(sym) => {
          if (modalSide === "in") setSymbolIn(sym);
          else if (modalSide === "out") setSymbolOut(sym);
          setModalSide(null);
        }}
      />
    </div>
  );
}
