import {
    Action as ReduxAction,
    createStore as reduxCreateStore,
    Store as ReduxStore,
    StoreEnhancer,
    Unsubscribe
} from 'redux';

import { Action, TypedAction } from './action';
import { Reducer } from './reducer';

/**
 * Internal reset action type
 */
const RESET = '@@ngfk/RESET';

export class Store<State, ActionMap> implements ReduxStore<State> {
    protected redux: ReduxStore<State>;
    protected initial?: State;

    /**
     * Creates a new instance of the Store class.
     * @param reducer The root reducer
     * @param initial The initial state
     */
    constructor(
        protected reducer: Reducer<State>,
        initial?: State,
        enhancer?: StoreEnhancer<State>
    ) {
        this.reducer = this.extendReducer(this.reducer);
        this.initial = initial || this.reducer();

        this.redux = reduxCreateStore<State>(
            this.reducer,
            this.initial,
            enhancer
        );
    }

    /**
     * Dispatches the provided action, triggering a state update.
     */
    public dispatch: Dispatch<ActionMap> = <
        Action extends ReduxAction,
        Type extends keyof ActionMap
    >(
        p1: Action | Type,
        p2?: ActionMap[Type]
    ): Action => {
        return typeof p1 === 'string'
            ? this.redux.dispatch({ type: p1, payload: p2 }) as any
            : this.redux.dispatch(p1);
    };

    /**
     * Read the current state within the store.
     */
    public getState = (): State => {
        return this.redux.getState();
    };

    /**
     * Subscribes to state changes.
     * @param listener Callback function performed on every next state
     */
    public subscribe = (listener: () => void): Unsubscribe => {
        return this.redux.subscribe(listener);
    };

    /**
     * Replaces the reducer currently used by the store to calculate the state.
     */
    public replaceReducer = (reducer: Reducer<State>): void => {
        this.reducer = reducer;
        this.redux.replaceReducer(this.reducer);
    };

    private extendReducer(originalReducer: Reducer<State>): Reducer<State> {
        // Construct and return a new reducer function
        const extended: any = (state?: State, action?: Action<any>): State => {
            // If we receive a reset action, skip the originalReducer and
            // simply return the new state provided in the action payload.
            if (action && action.type === RESET) {
                return action.payload;
            }

            // The rest of the actions are forwarded to the originalReducer
            return originalReducer(state, action);
        };

        return extended;
    }
}

export type Dispatch<ActionMap> = {
    /**
     * Dispatches the provided action, triggering a state update.
     * @param action The action
     */
    <Action extends ReduxAction>(action: Action): Action;

    /**
     * Dispatches the provided action, triggering a state update. This method
     * enforces type safety.
     * @param type The action type
     * @param payload The action payload
     */
    <Type extends keyof ActionMap>(
        type: Type,
        payload?: ActionMap[Type]
    ): TypedAction<Type, ActionMap[Type]>;
};

export type createStore = {
    <State, ActionMap>(
        reducer: Reducer<State>,
        enhancer?: StoreEnhancer<State>
    ): Store<State, ActionMap>;

    <State, ActionMap>(
        reducer: Reducer<State>,
        preloadedState: State,
        enhancer?: StoreEnhancer<State>
    ): Store<State, ActionMap>;
};

export const createStore: createStore = <State, ActionMap>(
    param1: Reducer<State>,
    param2?: State | StoreEnhancer<State>,
    param3?: StoreEnhancer<State>
): Store<State, ActionMap> => {
    return typeof param2 === 'function'
        ? new Store<State, ActionMap>(param1, undefined, param2)
        : new Store<State, ActionMap>(param1, param2, param3);
};
