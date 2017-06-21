import * as Redux from 'redux';

import { Reducer } from './reducer';
import { Store } from './store';

export const combineReducers = <T>(reducers: { [P in keyof T]: Reducer<T[P]> }): Reducer<T> => {
    return Redux.combineReducers<T>(reducers as any);
};

export interface StoreCreator {
  <TState, TActions>(
      reducer: Reducer<TState>,
      enhancer?: Redux.StoreEnhancer<TState>
      ): Store<TState, TActions>;

  <TState, TActions>(
      reducer: Reducer<TState>,
      preloadedState: TState,
      enhancer?: Redux.StoreEnhancer<TState>
      ): Store<TState, TActions>;
}

export const createStore: StoreCreator = <TState, TActions>(
    reducer: Reducer<TState>,
    initOrEnhancer?: TState | Redux.StoreEnhancer<TState>,
    enhancer?: Redux.StoreEnhancer<TState>
    ): Store <TState, TActions> =>
{
    return (typeof initOrEnhancer === 'function')
        ? new Store<TState, TActions>(reducer, undefined, initOrEnhancer)
        : new Store<TState, TActions>(reducer, initOrEnhancer, enhancer);
};
