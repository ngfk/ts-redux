import { Reducer, SubReducer } from './models/reducer';
import { ReducerBuilder } from './reducer-builder';

type Cases<State, ActionMap> = {
    [Type in keyof ActionMap]: SubReducer<State, ActionMap, Type>
};

export const createReducer = <State, ActionMap>(
    initial: State,
    cases: Cases<State, ActionMap>
): Reducer<State> => {
    let builder = new ReducerBuilder<State, ActionMap>();

    builder.init(initial);
    Object.keys(cases).forEach(type => {
        const key = type as keyof ActionMap;
        builder.case(key, cases[key]);
    });

    return builder.build();
};
