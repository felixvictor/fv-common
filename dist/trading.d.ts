//#region src/trading/nyse-date.d.ts
declare const getNyCalendar: (instant: Temporal.Instant) => {
  nyDate: Temporal.PlainDate;
  nyTime: Temporal.PlainTime;
};
declare const isNyseOpenAtDate: (nyDate: Temporal.PlainDate) => boolean;
declare const isNyseTradingDay: (instant?: Temporal.Instant) => boolean;
declare const getNyseTradingDay: (instant?: Temporal.Instant) => string;
declare const addNyseTradingDays: (tradingDay: string, tradingDaysToAdd: number) => string;
declare const isNyseEarlyCloseDay: (nyDate: Temporal.PlainDate) => boolean;
declare const isNyseEarlyCloseDataStale: (nyDate: Temporal.PlainDate) => boolean;
declare const isNyseHolidayDataStale: (nyDate: Temporal.PlainDate) => boolean;
declare const isNyseCalendarDataStale: (nyDate: Temporal.PlainDate) => boolean;
//#endregion
//#region src/trading/nyse-early-close-dates.d.ts
declare const nyseEarlyCloseDates: ReadonlySet<string>;
declare const nyseEarlyCloseDataKnownThroughYear = 2028;
declare const nyseEarlyCloseTime: Temporal.PlainTime;
declare const nyseEarlyCloseAfterHoursEndTime: Temporal.PlainTime;
//#endregion
//#region src/trading/nyse-holiday-dates.d.ts
declare const nyseHolidayDates: ReadonlySet<string>;
declare const nyseHolidayDataKnownThroughYear = 2028;
//#endregion
//#region src/trading/nyse-time-windows.interface.d.ts
interface EarlyCloseAdjustedTime {
  default: Temporal.PlainTime;
  earlyClose: Temporal.PlainTime;
}
interface PlainTimeWindow {
  end: EarlyCloseAdjustedTime | Temporal.PlainTime;
  start: Temporal.PlainTime;
}
interface TimeWindow {
  info: (nyDate: Temporal.PlainDate) => string;
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
    readonly text: "SEC edgar filing";
    readonly window: {
      readonly end: Temporal.PlainTime;
      readonly start: Temporal.PlainTime;
    };
  };
  readonly isNyseExtendedTradingHours: {
    readonly order: 3;
    readonly text: "Extended trading hours";
    readonly window: {
      readonly end: {
        readonly default: Temporal.PlainTime;
        readonly earlyClose: Temporal.PlainTime;
      };
      readonly start: Temporal.PlainTime;
    };
  };
  readonly isNyseMarketHours: {
    readonly order: 1;
    readonly text: "Regular market hours";
    readonly window: {
      readonly end: {
        readonly default: Temporal.PlainTime;
        readonly earlyClose: Temporal.PlainTime;
      };
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
export { type EarlyCloseAdjustedTime, type NyseTimeWindowKey, type PlainTimeWindow, type TimeWindow, addNyseTradingDays, getNyCalendar, getNyseTradingDay, isEdgarOperating, isNyseCalendarDataStale, isNyseEarlyCloseDataStale, isNyseEarlyCloseDay, isNyseExtendedTradingHours, isNyseHolidayDataStale, isNyseMarketHours, isNyseOpenAtDate, isNysePreMarket, isNyseTradingDay, nyseEarlyCloseAfterHoursEndTime, nyseEarlyCloseDataKnownThroughYear, nyseEarlyCloseDates, nyseEarlyCloseTime, nyseHolidayDataKnownThroughYear, nyseHolidayDates, nyseStatus, nyseTimeWindows };
//# sourceMappingURL=trading.d.ts.map