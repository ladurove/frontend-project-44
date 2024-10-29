
export function randomOf<T>(array: ReadonlyArray<T>): T {
    if (array.length === 0)
        throw Error("aaaaaa yaso.su|")
    const randomIndex = Math.round(Math.random() * array.length - 1)
    return array.at(randomIndex) as T
}
