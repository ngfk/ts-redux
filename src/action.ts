
export interface Action<T> {
    readonly type: string;
    readonly payload: T;
}

export interface TypedAction<T extends string, P> extends Action<P> {
    readonly type: T;
}
