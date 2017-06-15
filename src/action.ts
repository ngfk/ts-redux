
export interface Action<T> {
    readonly type: string;
    readonly payload: T;
}

export interface MappedAction<T extends string, P> extends Action<P> {
    readonly type: T;
    readonly payload: P;
}
