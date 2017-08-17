import * as Redux from 'redux';

import { Action, TypedAction } from './action';

export interface Reducer<TState> extends Redux.Reducer<TState> {
    (state: TState, action: Action<any>): TState;
}

export type SubReducer<TState, TMapping, T extends keyof TMapping> =
    (state: TState, payload: TMapping[T], action: TypedAction<T, TMapping[T]>) => TState;
