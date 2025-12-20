let currentLocale = "en"

export const setLocale = (locale: string): void => {
    currentLocale = locale
}

export const getLocale = (): string => currentLocale
