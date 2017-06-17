import * as Redux from 'redux';

export class ActionDispatcher<TActions, T extends keyof TActions> {

    constructor(private storeRef: Redux.Store<any>, private type: T) { }

    public dispatch(payload: TActions[T]): void {
        this.storeRef.dispatch({ type: this.type, payload });
    }
}
