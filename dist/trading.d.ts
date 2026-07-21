//#region src/trading/nyse-date.d.ts
declare const getNyCalendar: (instant: Temporal.Instant) => {
  nyDate: Temporal.PlainDate;
  nyTime: Temporal.PlainTime;
};
declare const isNyseOpenAtDate: (nyDate: Temporal.PlainDate) => boolean;
declare const isNyseTradingDay: (instant?: Temporal.Instant) => boolean;
declare const getNyseTradingDay: (instant?: Temporal.Instant) => string;
declare const addNyseTradingDays: (tradingDay: string, tradingDaysToAdd: number) => string;
//#endregion
//#region src/trading/nyse-time-windows.interface.d.ts
interface PlainTimeWindow {
  end: Temporal.PlainTime;
  start: Temporal.PlainTime;
}
interface TimeWindow {
  info: string;
  order: number;
  text: string;
  window: PlainTimeWindow;
}
//#endregion
//#region src/trading/nyse-time-windows.d.ts
type NyseTimeWindowKey = keyof typeof windows;
declare const windows: {
  readonly isEdgarOperating: {
    readonly order: 4;
    readonly text: "SEC Edgar filing";
    readonly window: {
      readonly end: Temporal.PlainTime;
      readonly start: Temporal.PlainTime;
    };
  };
  readonly isNyseExtendedTradingHours: {
    readonly order: 3;
    readonly text: "Extended trading hours";
    readonly window: {
      readonly end: Temporal.PlainTime;
      readonly start: Temporal.PlainTime;
    };
  };
  readonly isNyseMarketHours: {
    readonly order: 1;
    readonly text: "Regular market hours";
    readonly window: {
      readonly end: Temporal.PlainTime;
      readonly start: Temporal.PlainTime;
    };
  };
  readonly isNysePreMarket: {
    readonly order: 2;
    readonly text: "Pre-market";
    readonly window: {
      readonly end: Temporal.PlainTime;
      readonly start: Temporal.PlainTime;
    };
  };
};
declare const nyseTimeWindows: Record<string, TimeWindow>;
declare const isEdgarOperating: (instant?: Temporal.Instant) => boolean, isNyseExtendedTradingHours: (instant?: Temporal.Instant) => boolean, isNyseMarketHours: (instant?: Temporal.Instant) => boolean, isNysePreMarket: (instant?: Temporal.Instant) => boolean;
declare const nyseStatus: () => Record<NyseTimeWindowKey, boolean>;
//#endregion
export { type NyseTimeWindowKey, type PlainTimeWindow, type TimeWindow, addNyseTradingDays, getNyCalendar, getNyseTradingDay, isEdgarOperating, isNyseExtendedTradingHours, isNyseMarketHours, isNyseOpenAtDate, isNysePreMarket, isNyseTradingDay, nyseStatus, nyseTimeWindows };
//# sourceMappingURL=trading.d.ts.map