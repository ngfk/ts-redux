import { Reducer, SubReducer } from './models/reducer';
import { ReducerBuilder } from './reducer-builder';

export const createReducer = <State, ActionMap>(
    initial: State,
    cases: { [Type in keyof ActionMap]: SubReducer<State, ActionMap, Type> }
    ): Reducer<State> =>
{
    let builder = new ReducerBuilder<State, ActionMap>().init(initial);
    Object.keys(cases).forEach((type: keyof ActionMap) => builder.case(type, cases[type]));
    return builder.build();
};
