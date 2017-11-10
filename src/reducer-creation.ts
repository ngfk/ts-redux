import { Reducer, SubReducer } from './reducer';

/**
 * Utility class used to build a reducer in a type safe manner.
 */
export class ReducerBuilder<State, ActionMap> {
    private initial: State;
    private cases: {
        [type: string]: SubReducer<State, ActionMap, keyof ActionMap>;
    } = {};

    /**
     * Sets an initial state for the reducer.
     * @param initial The initial state
     */
    public init(initial: State): this {
        if (typeof initial === 'object') {
            if (Object.prototype.toString.call(initial) === '[object Array]') {
                // Create copy of the array
                this.initial = (initial as any).slice() as any;
            } else {
                // Create copy of the object
                this.initial = { ...(initial as any) };
            }
        } else {
            // No need to create a copy
            this.initial = initial;
        }
        return this;
    }

    /**
     * Links the provided action type with the sub-reducer function.
     * @param type The action type
     * @param reducer The sub-reducer function
     */
    public case<Type extends keyof ActionMap>(
        type: Type,
        reducer: SubReducer<State, ActionMap, Type>
    ): this {
        this.cases[type] = reducer as any;
        return this;
    }

    /**
     * Links the provided action type with the sub-reducer function, without
     * performing type checks.
     * @param type The action type
     * @param reducer The sub-reducer function
     */
    public external(type: string, reducer: SubReducer<State, any, any>): this {
        this.cases[type] = reducer;
        return this;
    }

    /**
     * Build the reducer.
     */
    public build(): Reducer<State> {
        // An initial action is created to allow the reducer to be called
        // without parameters, returning the initial state.
        const initialAction: any = {
            type: '',
            payload: {}
        };

        return (state = this.initial, action = initialAction): State => {
            const handler = this.cases[action.type];

            // Execute the handler to retrieve the new state or, if no handler
            // is found, return the state as is.
            return handler ? handler(state, action.payload, action) : state;
        };
    }
}

/**
 * Creates a reducer in a type safe manner.
 * @param initial The initial state
 * @param cases The action handlers
 */
export const createReducer = <State, ActionMap>(
    initial: State,
    cases: { [Type in keyof ActionMap]: SubReducer<State, ActionMap, Type> }
): Reducer<State> => {
    // Create a reducer builder and set it's properties
    const builder = new ReducerBuilder<State, ActionMap>().init(initial);
    Object.keys(cases).forEach(type => {
        const key = type as keyof ActionMap;
        builder.external(key, cases[key]);
    });

    // Build & return the reducer
    return builder.build();
};

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
