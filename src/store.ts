import * as Redux from 'redux';

import { ActionDispatcher } from './action-dispatcher';
import { Action } from './action';
import { Reducer } from './reducer';

const PURGE = '@@TSREDUX:PURGE';

export class Store<TState, TActions> implements Redux.Store<TState> {

    protected redux: Redux.Store<TState>;
    protected reducer: Reducer<TState>;
    private initial?: TState;

    constructor(reducer: Reducer<TState>, initialState?: TState) {
        this.reducer = this.extendReducer(reducer);
        this.initial = initialState;

        this.redux = Redux.createStore<TState>(
            this.reducer,
            this.initialState,
            (window && (window as any).devToolsExtension) ? (window as any).devToolsExtension() : undefined
        );
    }

    public get initialState(): TState {
        return this.initial || (this.reducer as Reducer<any>)(undefined, { type: '', payload: undefined });
    }

    public set initialState(state: TState) {
        this.initial = state;
    }

    public dispatch(action: Action): Action {
        return this.redux.dispatch(action);
    }

    public getState(): TState {
        return this.redux.getState();
    }

    public subscribe(listener: () => void): Redux.Unsubscribe {
        return this.redux.subscribe(listener);
    }

    public replaceReducer(reducer: Reducer<TState>): void {
        this.reducer = this.extendReducer(reducer);
        this.redux.replaceReducer(this.reducer);
    }

    public purge(state = this.initialState): void {
        this.redux.dispatch({ type: PURGE, payload: state });
    }

    public action<T extends keyof TActions>(type: T): ActionDispatcher<TActions, T> {
        return new ActionDispatcher<TActions, T>(this, type);
    }

    private extendReducer(reducer: Reducer<TState>): Reducer<TState> {
        return (state: TState, action: Action): TState => {
            if (action.type === PURGE)
                return action.payload;

            return reducer(state, action);
        }
    }
}
