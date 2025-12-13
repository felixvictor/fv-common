export const getElementWidth = (element: HTMLElement | SVGElement): number => {
    const { width } = element.getBoundingClientRect()

    return Math.floor(width)
}
