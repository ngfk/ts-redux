import { AnyAction } from 'redux';

export interface ActionError {
    readonly message: string;
    readonly [properties: string]: any;
}

export interface ActionMetadata {
    readonly [properties: string]: any;
}

export interface Action<Payload = {}> extends AnyAction {
    readonly type: string;
    readonly payload: Payload;
    readonly error?: ActionError;
    readonly meta?: ActionMetadata;
}

export interface TypedAction<Type extends string, Payload = {}> extends Action<Payload> {
    readonly type: Type;
}
