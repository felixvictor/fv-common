//#region src/trading/nyse.d.ts
declare const isNyseTradingDay: (instant?: Temporal.Instant) => boolean;
declare const getNyseTradingDay: (instant?: Temporal.Instant) => string;
declare const isNyseOpen: (instant?: Temporal.Instant) => boolean;
declare const isNysePreMarket: (instant?: Temporal.Instant) => boolean;
declare const isNyseExtendedTradingHours: (instant?: Temporal.Instant) => boolean;
declare const isEdgarOperating: (instant?: Temporal.Instant) => boolean;
declare const nyseStatus: () => {
  isEdgarOperating: boolean;
  isNyseExtendedTradingHours: boolean;
  isNyseOpen: boolean;
  isNysePreMarket: boolean;
};
declare const addNyseTradingDays: (tradingDay: string, tradingDaysToAdd: number) => string;
//#endregion
export { addNyseTradingDays, getNyseTradingDay, isEdgarOperating, isNyseExtendedTradingHours, isNyseOpen, isNysePreMarket, isNyseTradingDay, nyseStatus };
//# sourceMappingURL=trading.d.ts.map