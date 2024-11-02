export interface Expectation<V, R> {
    emit(value: V): Promise<R>
}
