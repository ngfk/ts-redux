import { StoreEnhancer } from 'redux';

import { Reducer } from './models/reducer';
import { Store } from './store';

export const createStore: {
    // tslint:disable max-line-length
    <State, ActionMap>(reducer: Reducer<State>, enhancer?: StoreEnhancer<State>): Store<State, ActionMap>;
    <State, ActionMap>(reducer: Reducer<State>, preloadedState: State, enhancer?: StoreEnhancer<State>): Store<State, ActionMap>
    // tslint:enable max-line-length
} = <State, ActionMap>(
    param1: Reducer<State>,
    param2?: State | StoreEnhancer<State>,
    param3?: StoreEnhancer<State>
    ): Store <State, ActionMap> =>
{
    return (typeof param2 === 'function')
        ? new Store<State, ActionMap>(param1, undefined, param2)
        : new Store<State, ActionMap>(param1, param2, param3);
};