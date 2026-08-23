export const dateToString = (date: Date): string => {
    const plainDate = new Temporal.PlainDate(date.getFullYear(), date.getMonth() + 1, date.getDate())

    return plainDate.toString() // "YYYY-MM-DD"
}
