import { TypedAction } from './action';
import { Reducer, SubReducer } from './reducer';

export class ReducerBuilder<TState, TMapping> {

    private initial: TState;
    private cases: { [type: string]: SubReducer<TState, TMapping, keyof TMapping> } = {};

    public init(state: TState): this {
        this.initial = state;
        return this;
    }

    public case<Type extends keyof TMapping>(type: Type, reducer: SubReducer<TState, TMapping, Type>): this {
        this.cases[type] = reducer;
        return this;
    }

    public external(type: string, reducer: SubReducer<TState, any, any>): this {
        this.cases[type] = reducer;
        return this;
    }

    public build(): Reducer<TState> {
        return (state: TState = this.initial, action: TypedAction<any, any> = { type: '', payload: undefined }) => {
            const handler = this.cases[action.type];
            return handler ? handler(state, action.payload, action) : state;
        };
    }
}
