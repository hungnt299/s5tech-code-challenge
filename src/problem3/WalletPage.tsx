// ISSUE: Missing `blockchain` field but used later → type/runtime mismatch
// FIX: Add `blockchain: string` (or a typed union) to `WalletBalance`.
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// ISSUE: Extends `BoxProps` but this component renders a native div.
// FIX: Either render a `Box` or change Props to `React.HTMLAttributes<HTMLDivElement>`.
interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // ISSUE: `any` loses type safety; long switch is verbose.
  // FIX: Use a typed union and a lookup map with default
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // ISSUE: `lhsPriority` is undefined; likely meant `balancePriority`.
        // ISSUE: Keeps amount <= 0 (usually we exclude non-positive balances).
        // FIX: `return balancePriority > -99 && balance.amount > 0`.
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        // ISSUE: Recomputes priorities inside comparator; precompute once if possible.
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // ISSUE: Missing `return 0` on tie → unstable ordering.
        // FIX: Return 0 or add a secondary criterion.
      });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    // ISSUE: This array is never used; dead computation.
    // FIX: Use it downstream or remove it.
    return {
      ...balance,
      // ISSUE: `toFixed()` without precision is ambiguous.
      // FIX: Use explicit precision like `toFixed(2)`.
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      // ISSUE: `sortedBalances` elements do not have `formatted`; type mismatch.
      // FIX: Map to an enriched type before rendering.
      // ISSUE: `prices[balance.currency]` may be undefined → NaN.
      // FIX: Use `(prices?.[balance.currency] ?? 0) * balance.amount`.
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          // ISSUE: `classes` is not defined/imported.
          // FIX: Provide a valid className or import styles.
          key={index}
          // ISSUE: Using array index as key causes unstable re-renders.
          // FIX: Use a stable key, e.g., `key={balance.currency}`.
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  // ISSUE: `children` was destructured but is not rendered.
  // FIX: Include `{children}` if intended.
  return <div {...rest}>{rows}</div>;
};
