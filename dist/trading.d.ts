export declare const getNyCalendar: (instant?: Temporal.Instant) => {
  nyDate: Temporal.PlainDate;
  nyDateTime: Temporal.PlainDateTime;
  nyTime: Temporal.PlainTime;
  nyZonedDateTime: Temporal.ZonedDateTime;
};
export declare const isNyseOpenAtDate: (nyDate: Temporal.PlainDate) => boolean;
export declare const isSecOpenAtDate: (nyDate: Temporal.PlainDate) => boolean;
export declare const isNyseTradingDay: (instant?: Temporal.Instant) => boolean;
export declare const getNyseTradingDay: (instant?: Temporal.Instant) => string;
export declare const addNyseTradingDays: (tradingDay: string, tradingDaysToAdd: number) => string;
export declare const isNyseEarlyCloseDay: (nyDate: Temporal.PlainDate) => boolean;
export declare const isNyseEarlyCloseDataStale: (nyDate: Temporal.PlainDate) => boolean;
export declare const isNyseHolidayDataStale: (nyDate: Temporal.PlainDate) => boolean;
export declare const isSecHolidayDataStale: (nyDate: Temporal.PlainDate) => boolean;
export declare const isNyseCalendarDataStale: (nyDate: Temporal.PlainDate) => boolean;
export declare const toNyInstant: (nyDate: string, nyTime: Temporal.PlainTime) => Temporal.Instant;
export declare const nyseEarlyCloseDates: ReadonlySet<string>;
export declare const nyseEarlyCloseDataKnownThroughYear = 2028;
export declare const nyseEarlyCloseTime: Temporal.PlainTime;
export declare const nyseEarlyCloseAfterHoursEndTime: Temporal.PlainTime;
export declare const nyseHolidayDates: ReadonlySet<string>;
export declare const nyseHolidayDataKnownThroughYear = 2028;
export interface EarlyCloseAdjustedTime {
  default: Temporal.PlainTime;
  earlyClose: Temporal.PlainTime;
}
export interface PlainTimeWindow {
  end: EarlyCloseAdjustedTime | Temporal.PlainTime;
  start: Temporal.PlainTime;
}
export interface TimeWindow {
  info: (nyDate?: Temporal.PlainDate) => string;
  order: number;
  text: string;
  window: PlainTimeWindow;
}
export type NyseTimeWindowKey = keyof typeof windows;
export declare const nyseRegularSessionOpenTime: Temporal.PlainTime;
export declare const nyseRegularSessionDefaultCloseTime: Temporal.PlainTime;
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
export declare const nyseTimeWindows: Record<string, TimeWindow>;
export declare const isEdgarOperating: (instant?: Temporal.Instant) => boolean, isNyseExtendedTradingHours: (instant?: Temporal.Instant) => boolean, isNyseMarketHours: (instant?: Temporal.Instant) => boolean, isNysePreMarket: (instant?: Temporal.Instant) => boolean;
export declare const nyseStatus: () => Record<NyseTimeWindowKey, boolean>;
export declare const secHolidayDates: ReadonlySet<string>;
export declare const secHolidayDataKnownThroughYear = 2028;
export {};
//# sourceMappingURL=trading.d.ts.map