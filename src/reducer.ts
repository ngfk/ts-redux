import { Action, MappedAction } from './action';

export interface Reducer<TState> {
    (state: TState, action: Action<any>): TState;
}

export type MappedReducer<TState, TMapping, T extends keyof TMapping> =
    (state: TState, payload: TMapping[T], action: MappedAction<T, TMapping[T]>) => TState;
