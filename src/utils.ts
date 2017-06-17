import { combineReducers as ReduxCombineReducers, StoreEnhancer } from 'redux';

import { Reducer } from './reducer';
import { Store } from './store';

export const combineReducers = <T>(reducers: { [P in keyof T]: Reducer<any> }): Reducer<T> => {
    return ReduxCombineReducers<T>(reducers as any);
}

export interface StoreCreator {
  <TState, TActions>(reducer: Reducer<TState>, enhancer?: StoreEnhancer<TState>): Store<TState, TActions>;
  <TState, TActions>(reducer: Reducer<TState>, preloadedState: TState, enhancer?: StoreEnhancer<TState>): Store<TState, TActions>;
}

export const createStore: StoreCreator = <TState, TActions>(reducer: Reducer<TState>, initOrEnhancer?: TState | StoreEnhancer<TState>, enhancer?: StoreEnhancer<TState>) => {
    return (typeof initOrEnhancer === 'function')
        ? new Store<TState, TActions>(reducer, undefined, initOrEnhancer)
        : new Store<TState, TActions>(reducer, initOrEnhancer, enhancer);
}
