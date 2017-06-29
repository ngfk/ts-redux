import * as Redux from 'redux';

export interface Action<T> extends Redux.Action {
    readonly type: string;
    readonly payload: T;
}

export interface TypedAction<T extends string, P> extends Action<P> {
    readonly type: T;
}
