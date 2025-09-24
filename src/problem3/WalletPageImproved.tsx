import React from "react";

// Add `blockchain: string` (or a typed union) to `WalletBalance`.
export type Blockchain =
  | "Osmosis"
  | "Ethereum"
  | "Arbitrum"
  | "Zilliqa"
  | "Neo"
  | (string & {});

export interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

export interface EnrichedWalletBalance extends WalletBalance {
  priority: number;
  formatted: string;
  usdValue: number;
}

export type Prices = Record<string, number>;

// Either render a `Box` or change Props to `React.HTMLAttributes<HTMLDivElement>`.
export interface Props extends React.HTMLAttributes<HTMLDivElement> {}

// Replace the long switch-case with a lookup map (avoids repetition and is
// faster to read/maintain). Unknown chains default to -99 via getPriority.
const PRIORITY_MAP: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

// Centralized priority function; returns -99 for unsupported chains to filter out.
export function getPriority(blockchain: Blockchain): number {
  return PRIORITY_MAP[blockchain] ?? -99;
}

declare function useWalletBalances(): WalletBalance[];
declare function usePrices(): Prices;

interface WalletRowProps {
  className?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}

declare const WalletRow: React.FC<WalletRowProps>;

export const WalletPage: React.FC<Props> = (props) => {
  const { children, className, ...rest } = props;

  const balances = useWalletBalances();
  const prices = usePrices();

  // Single memoized pipeline: map → filter → sort. This avoids recomputing
  // priorities in the comparator and ensures deterministic ordering.
  const balancesForRender = React.useMemo<EnrichedWalletBalance[]>(() => {
    if (!Array.isArray(balances)) return [];

    return balances
      .map((balance: WalletBalance) => {
        const priority = getPriority(balance.blockchain); // compute once
        const price = prices?.[balance.currency] ?? 0; // default 0 to avoid NaN
        const usdValue = price * balance.amount;
        return {
          ...balance,
          priority,
          formatted: balance.amount.toFixed(2), // explicit precision
          usdValue,
        };
      })
      .filter((b: EnrichedWalletBalance) => b.priority > -99 && b.amount > 0) // exclude invalid/non-positive
      .sort((a: EnrichedWalletBalance, b: EnrichedWalletBalance) => {
        // Complete comparator: priority desc → usd desc → currency asc
        if (a.priority !== b.priority) return b.priority - a.priority;
        if (a.usdValue !== b.usdValue) return b.usdValue - a.usdValue;
        return a.currency.localeCompare(b.currency);
      });
  }, [balances, prices]);

  return (
    <div className={className} {...rest}>
      {balancesForRender.map((balance: EnrichedWalletBalance) => (
        <WalletRow
          key={balance.currency} // stable key vs array index
          className={"row"}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
      {children}
    </div>
  );
};
