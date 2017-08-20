import * as Redux from 'redux';

import { ActionCreator } from './action-creator';
import { Reducer, SubReducer } from './reducer';
import { ReducerBuilder } from './reducer-builder';
import { Store } from './store';

export const createReducer = <TState, TMapping>(
    initial: TState,
    cases: { [Type in keyof TMapping]: SubReducer<TState, TMapping, Type> }
    ): Reducer<TState> =>
{
    let builder = new ReducerBuilder<TState, TMapping>().init(initial);
    for (let type of Object.keys(cases))
        builder.case(type as keyof TMapping, cases[type]);
    return builder.build();
};

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

export const bindActionCreators = (
    creators: { [creator: string]: ActionCreator<any, any> },
    dispatcher: Redux.Dispatch<any>
    ) =>
{
    return Redux.bindActionCreators(creators, dispatcher);
};
