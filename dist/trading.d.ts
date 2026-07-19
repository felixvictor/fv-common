//#region src/trading/nyse.d.ts
declare const isNyseTradingDay: (instant?: Temporal.Instant) => boolean;
declare const getNyseTradingDay: (instant?: Temporal.Instant) => string;
declare const isNysePreMarket: (instant?: Temporal.Instant) => boolean;
declare const isNyseExtendedTradingHours: (instant?: Temporal.Instant) => boolean;
declare const isEdgarOperating: (instant?: Temporal.Instant) => boolean;
declare const addNyseTradingDays: (tradingDay: string, tradingDaysToAdd: number) => string;
//#endregion
export { addNyseTradingDays, getNyseTradingDay, isEdgarOperating, isNyseExtendedTradingHours, isNysePreMarket, isNyseTradingDay };
//# sourceMappingURL=trading.d.ts.map