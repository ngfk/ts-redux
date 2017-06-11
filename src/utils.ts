import * as Redux from 'Redux';

import { Reducer } from './reducer';
import { Store } from './store';

export const combineReducers = <T>(reducers: { [P in keyof T]: Reducer<any> }): Reducer<T> => {
    return Redux.combineReducers<T>(reducers as any);
}

export const createStore = <TState, TActions>(reducer: Reducer<TState>, initial?: TState) => {
    return new Store<TState, TActions>(reducer, initial);
}
