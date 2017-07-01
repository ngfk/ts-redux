import * as Redux from 'redux';

import { ActionDispatcher } from './action-dispatcher';
import { Reducer } from './reducer';

export class Store<TState, TActions> implements Redux.Store<TState> {

    protected redux: Redux.Store<TState>;
    private initial?: TState;

    constructor(protected reducer: Reducer<TState>, initialState?: TState, enhancer?: Redux.StoreEnhancer<TState>) {
        this.initial = initialState;

        this.redux = Redux.createStore<TState>(
            this.reducer,
            initialState || (this.reducer as Reducer<any>)(undefined, { type: '', payload: undefined }),
            enhancer
        );
    }

    public dispatch<T extends Redux.Action>(action: T): T {
        return this.redux.dispatch(action);
    }

    public getState(): TState {
        return this.redux.getState();
    }

    public subscribe(listener: () => void): Redux.Unsubscribe {
        return this.redux.subscribe(listener);
    }

    public replaceReducer(reducer: Reducer<TState>): void {
        this.reducer = reducer;
        this.redux.replaceReducer(this.reducer);
    }

    public action<T extends keyof TActions>(type: T): ActionDispatcher<TState, TActions, T> {
        return new ActionDispatcher<TState, TActions, T>(this, type);
    }
}
