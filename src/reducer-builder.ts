import { Action } from './models/action';
import { Reducer, SubReducer } from './models/reducer';

export class ReducerBuilder<State, ActionMap> {
    private initial: State;
    private cases: { [type: string]: SubReducer<State, ActionMap, keyof ActionMap> } = {};

    public init(state: State): this {
        this.initial = state;
        return this;
    }

    public case<Type extends keyof ActionMap>(type: Type, reducer: SubReducer<State, ActionMap, Type>): this {
        this.cases[type] = reducer;
        return this;
    }

    public external(type: string, reducer: SubReducer<State, any, any>): this {
        this.cases[type] = reducer;
        return this;
    }

    public build(): Reducer<State> {
        const initialAction: Action<any> = {
            type: '',
            payload: {}
        };

        return (state = this.initial, action = initialAction as any): State => {
            const handler = this.cases[action.type];
            return handler ? handler(state, action.payload, action) : state;
        };
    }
}
