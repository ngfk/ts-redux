
export interface Action {
    readonly type: string;
    readonly payload: any;
}

export interface MappedAction<T extends string, P> extends Action {
    readonly type: T;
    readonly payload: P;
}
