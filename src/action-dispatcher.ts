import { Store } from './store';

export class ActionDispatcher<TState, TActions, T extends keyof TActions> {

    constructor(private storeRef: Store<TState, TActions>, private type: T) { }

    public dispatch(payload: TActions[T]): Store<TState, TActions> {
        this.storeRef.dispatch({ type: this.type, payload });
        return this.storeRef;
    }
}
