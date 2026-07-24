/**
 * NYSE 13:00 ET early-close days, from https://www.nyse.com/trade/hours-calendars.
 * Covers years through `nyseEarlyCloseDataKnownThroughYear`.
 */
export const nyseEarlyCloseDates: ReadonlySet<string> = new Set([
    "2026-11-27", // Day after Thanksgiving
    "2026-12-24", // Christmas Eve
    "2027-11-26", // Day after Thanksgiving
    "2028-07-03", // Day before Independence Day
    "2028-11-24", // Day after Thanksgiving
])

export const nyseEarlyCloseDataKnownThroughYear = 2028

/** Regular session close on an early-close day. */
export const nyseEarlyCloseTime = Temporal.PlainTime.from({ hour: 13, minute: 0 })

/** Exchange after-hours close on an early-close day. IBKR's overnight session is unaffected. */
export const nyseEarlyCloseAfterHoursEndTime = Temporal.PlainTime.from({ hour: 17, minute: 0 })
