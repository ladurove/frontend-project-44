export interface Queue<T> {
    next(): Promise<T>;
}
export interface MutableQueue<T> extends Queue<T> {
    push(value: T): void;
    unshift(value: T): void;
}
export declare function MutableQueue<T>(): MutableQueue<T>;
//# sourceMappingURL=Queue.d.ts.map