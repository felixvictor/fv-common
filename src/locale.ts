let currentLocale = "en-GB"
const localeChangeCallbacks: (() => void)[] = []

export const setLocale = (locale: string): void => {
    if (currentLocale !== locale) {
        currentLocale = locale
        // Notify all registered callbacks
        for (const callback of localeChangeCallbacks) callback()
    }
}

export const getLocale = (): string => currentLocale

/**
 * Register a callback to be called whenever the locale changes.
 * @param callback - Function to call on locale change
 */
export const onLocaleChange = (callback: () => void): void => {
    localeChangeCallbacks.push(callback)
}
