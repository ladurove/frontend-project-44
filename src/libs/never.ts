
export function never(value: never): never {
    throw Error("unreachable")
}
