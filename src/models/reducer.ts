import { Reducer as ReduxReducer } from 'redux';

import { Action, TypedAction } from './action';

export interface Reducer<State> extends ReduxReducer<State> {
    (state: State, action: Action<any>): State;
}

export type SubReducer<State, ActionMap, Type extends keyof ActionMap> =
    (state: State, payload: ActionMap[Type], action: TypedAction<Type, ActionMap[Type]>) => State;
