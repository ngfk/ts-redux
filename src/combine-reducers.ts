import { combineReducers as reduxCombineReducers } from 'redux';

import { Reducer } from './models/reducer';

export type ReducersMap<ActionMap> = { [Type in keyof ActionMap]: Reducer<ActionMap[Type]> };

export const combineReducers = <ActionMap>(reducers: ReducersMap<ActionMap>): Reducer<ActionMap> => {
    return reduxCombineReducers<ActionMap>(reducers as any);
};
