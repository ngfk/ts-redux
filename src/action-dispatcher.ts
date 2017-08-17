import { Store } from './store';
import { TypedAction } from './action';

export class ActionDispatcher<TState, TActions, T extends keyof TActions> {

    constructor(private store: Store<TState, TActions>, private type: T) { }

    public dispatch(payload: TActions[T]): TypedAction<T, TActions[T]> {
        return this.store.dispatch({ type: this.type, payload });
    }
}
