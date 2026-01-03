import { cCombiningDiaeresis } from "../unicode"

export const convertNameForEmail = (name: string): string => {
    return (
        name
            .trim()
            .toLocaleLowerCase()
            .replaceAll(" ", ".")
            .replaceAll("ß", "ss")
            .normalize("NFD")
            // Convert umlauts, ie. input "ä" -> normalise to "a\u0308" -> output "ae"
            .replaceAll(cCombiningDiaeresis, "e")
            // Remove accents, ie. input "é" -> normalise to "e\u0301" -> output "e"
            .replaceAll(/\p{Diacritic}/gu, "")
    )
}
