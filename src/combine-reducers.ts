import { combineReducers as rCombineReducers } from 'redux';
import { Reducer } from './models/reducer';

export type ReducersMap<ActionMap> = {[Type in keyof ActionMap]: Reducer<ActionMap[Type]> };

export const combineReducers = <ActionMap>(reducers: ReducersMap<ActionMap>): Reducer<ActionMap> => {
    return rCombineReducers<ActionMap>(reducers as any);
};
