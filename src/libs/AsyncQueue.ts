

export interface AsyncQueue<T> {
    next(): Promise<T>
}

export interface MutableAsyncQueue<T> extends AsyncQueue<T> {
    push(value: T): void
}


class MutableAsyncQueueImpl<T> implements MutableAsyncQueue<T> {
    private list: T[] = []

    push(value: T): void {
        this.list.push(value)
    }

    async next(): Promise<T> {
        while (true) { // знаю говно
            await new Promise((resolve) => setTimeout(resolve, 50))
            if (this.list.length > 0) {
                return this.list[0]
            }
        }
    }
}


export function MutableAsyncQueue<T>(): MutableAsyncQueue<T> {
    return new MutableAsyncQueueImpl()
}
