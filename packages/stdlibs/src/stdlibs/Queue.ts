export interface Queue<T> {
    next(): Promise<T>
}

export interface MutableQueue<T> extends Queue<T> {
    push(value: T): void
    unshift(value: T): void
}

class MutableQueueImpl<T> implements MutableQueue<T> {
    private list: T[] = []
    private listListeners: ((value: T) => void)[] = []

    push(value: T) {
        this.list.push(value)
        this.listListeners.forEach((callback) => callback(value))
        this.listListeners.splice(0, this.listListeners.length)
    }

    unshift(value: T) {
        this.list.unshift(value)
        this.listListeners.forEach((callback) => callback(value))
        this.listListeners.splice(0, this.listListeners.length)
    }

    next(): Promise<T> {
        if (this.list.length > 0)
            return Promise.resolve(this.list.shift() as T)
        return new Promise((resolve) => {
            this.listListeners.push((value) =>
                resolve(value)
            )
        })
    }
}

export function MutableQueue<T>(): MutableQueue<T> {
    return new MutableQueueImpl<T>()
}
