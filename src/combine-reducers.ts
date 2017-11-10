import { Reducer } from './models/reducer';

/**
 * Combine different reducers into a single reducer. It will call every child
 * reducer and combine the results into a single state.
 * @param reducers Mapping of the reducers to combine
 */
export const combineReducers = <State>(
    reducers: { [key in keyof State]: Reducer<State[key]> }
): Reducer<State> => {
    // Create combined reducer. Within this function the state is cast to the
    // any type allowing it to be indexable.
    return (state: any = {}, action: any) => {
        // Loop over the reducer mapping keys, which are equals to the state
        // keys. Then reduce it to a new state.
        return Object.keys(reducers).reduce(
            (newState, type) => {
                const key = type as keyof State;

                // Set every property in the new state object
                newState[key] = reducers[key](state[key], action);
                return newState;
            },
            // Create a new state object instead of modifying the old object
            {} as State
        );
    };
};
