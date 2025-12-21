import dayjs from "dayjs";

//#region src/na/constants.d.ts

/**
 * The hour (UTC) when server maintenance/reset occurs.
 * Server day boundaries align with this time.
 */
declare const serverMaintenanceHour = 10;
//#endregion
//#region src/na/server-time.d.ts
/**
 * Get current server start (date and time).
 * This is the most recent maintenance time that has passed.
 */
declare const getCurrentServerStart: () => dayjs.Dayjs;
/**
 * Get previous server start (date and time).
 */
declare const getPreviousServerStart: () => dayjs.Dayjs;
/**
 * Get next server start (date and time).
 */
declare const getNextServerStart: () => dayjs.Dayjs;
/**
 * Current server start datetime formatted as "YYYY-MM-DD HH:mm".
 */
declare const currentServerStartDateTime: string;
/**
 * Current server start date formatted as "YYYY-MM-DD".
 */
declare const currentServerStartDate: string;
/**
 * Previous server start date formatted as "YYYY-MM-DD".
 */
declare const previousServerStartDate: string;
/**
 * Current server date year as a string.
 */
declare const currentServerDateYear: string;
/**
 * Current server date month as a zero-padded string (01-12).
 */
declare const currentServerDateMonth: string;
//#endregion
export { currentServerDateMonth, currentServerDateYear, currentServerStartDate, currentServerStartDateTime, getCurrentServerStart, getNextServerStart, getPreviousServerStart, previousServerStartDate, serverMaintenanceHour };
//# sourceMappingURL=na.d.ts.map