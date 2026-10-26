/**
 * Checks whether `timeZone` is a time zone that Temporal accepts: an IANA name (`Europe/Berlin`, `UTC`) or a UTC offset
 * (`+02:00`).
 */
export const isValidTimeZone = (timeZone: string): boolean => {
    try {
        Temporal.Now.zonedDateTimeISO(timeZone)
        return true
    } catch (error: unknown) {
        if (error instanceof RangeError) return false
        throw error
    }
}
