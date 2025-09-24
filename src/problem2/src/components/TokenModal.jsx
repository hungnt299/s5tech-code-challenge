import React, { useMemo, useState, useEffect } from "react";
import { formatNumber } from "../helpers.js";
import _ from "lodash";

export default function TokenModal({
  open,
  onClose,
  prices,
  balances,
  excludeSymbol,
  onlyWithBalance,
  onSelect,
  activeSymbol,
}) {
  const [q, setQ] = useState("");

  // Reset search input when modal is closed
  useEffect(() => {
    if (!open) {
      setQ("");
    }
  }, [open]);

  const normalized = useMemo(() => {
    return _.uniqBy(prices, (p) => p.currency); // de-duplicate by currency
  }, [prices]);

  const filtered = useMemo(() => {
    const s = _.toLower(_.trim(q));
    let list = normalized;
    // Filter by balance if requested (You pay)
    if (onlyWithBalance) {
      list = _.filter(list, (p) => (balances?.[p.currency] ?? 0) > 0);
    }
    // Exclude a symbol if requested (You receive excludes the "in" token)
    if (excludeSymbol) {
      list = _.filter(list, (p) => p.currency !== excludeSymbol);
    }
    if (!s) return list;
    return _.filter(list, (p) => _.includes(_.toLower(p.currency), s));
  }, [q, normalized, balances, onlyWithBalance, excludeSymbol]);

  if (!open) return null;

  return (
    <div
      className="modal"
      aria-hidden={String(!open)}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="modal-card">
        <div className="modal-head">
          <h3 id="token-modal-title">Select a token</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <i className="bx bx-x"></i>
          </button>
        </div>
        <input
          id="token-search"
          placeholder="Search token"
          aria-label="Search token"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div
          className={`token-list ${_.size(filtered) === 0 ? "!h-full" : ""}`}
          role="listbox"
          aria-label="Tokens"
        >
          {_.size(filtered) === 0 ? (
            <div className="token-empty" role="note">
              No tokens found
            </div>
          ) : (
            _.map(filtered, (t) => (
              <button
                key={t.currency}
                className={`token-item${
                  t.currency === activeSymbol ? " is-active" : ""
                }`}
                role="option"
                aria-selected={t.currency === activeSymbol}
                onClick={() => onSelect?.(t.currency)}
              >
                <span className="token-meta">
                  <img
                    src={`/images/tokens/${t.currency}.svg`}
                    className="token-logo"
                    aria-hidden="true"
                    width={24}
                    height={24}
                  ></img>
                  <span className="token-symbol-strong">{t.currency}</span>
                </span>
                <span className="token-right">
                  <span className="token-price">${formatNumber(t.price)}</span>
                  <span className="token-balance">
                    Balance: {formatNumber(balances?.[t.currency] ?? 0)}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
