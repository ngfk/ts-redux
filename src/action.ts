import * as Redux from 'redux';

export interface ActionError {
    readonly message: string;
    readonly [properties: string]: any;
}

export interface ActionMetadata {
    readonly [properties: string]: any;
}

export interface Action<T> extends Redux.AnyAction {
    readonly type: string;
    readonly payload: T;
    readonly error?: ActionError;
    readonly meta?: ActionMetadata;
}

export interface TypedAction<T extends string, P> extends Action<P> {
    readonly type: T;
}
