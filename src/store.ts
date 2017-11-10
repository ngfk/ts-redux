import {
    Action as ReduxAction,
    createStore,
    Store as ReduxStore,
    StoreEnhancer,
    Unsubscribe
} from 'redux';

import { TypedAction } from './models/action';
import { Reducer } from './models/reducer';

export class Store<State, ActionMap> implements ReduxStore<State> {
    protected redux: ReduxStore<State>;
    protected initial?: State;

    constructor(
        protected reducer: Reducer<State>,
        initial?: State,
        enhancer?: StoreEnhancer<State>
    ) {
        this.initial = initial || reducer();

        this.redux = createStore<State>(
            this.reducer,
            initial ||
                (this.reducer as Reducer<any>)(undefined, {
                    type: '',
                    payload: undefined
                }),
            enhancer
        );
    }

    public dispatch = <Action extends ReduxAction>(action: Action): Action => {
        return this.redux.dispatch(action);
    };

    public getState = (): State => {
        return this.redux.getState();
    };

    public subscribe = (listener: () => void): Unsubscribe => {
        return this.redux.subscribe(listener);
    };

    public replaceReducer = (reducer: Reducer<State>): void => {
        this.reducer = reducer;
        this.redux.replaceReducer(this.reducer);
    };

    public action = <Type extends keyof ActionMap>(
        type: Type
    ): StoreAction<State, ActionMap, Type> => {
        return new StoreAction<State, ActionMap, Type>(this, type);
    };
}

export class StoreAction<State, ActionMap, Type extends keyof ActionMap> {
    constructor(private store: Store<State, ActionMap>, private type: Type) {}

    public dispatch(
        payload?: ActionMap[Type]
    ): TypedAction<Type, ActionMap[Type]> {
        return this.store.dispatch({ type: this.type, payload: payload! });
    }
}
