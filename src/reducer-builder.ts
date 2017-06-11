import { MappedAction } from './action';
import { Reducer, MappedReducer } from './reducer';

export class ReducerBuilder<TState, TMapping> {

    private initial: TState;
    private cases: { [type: string]: MappedReducer<TState, TMapping, keyof TMapping> } = {};

    public init(state: TState): this {
        this.initial = state;
        return this;
    }

    public case<Type extends keyof TMapping>(type: Type, reducer: MappedReducer<TState, TMapping, Type>): this {
        this.cases[type] = reducer;
        return this;
    }

    public external(type: string, reducer: MappedReducer<TState, any, any>): this {
        this.cases[type] = reducer;
        return this;
    }

    public build(): Reducer<TState> {
        return (state: TState = this.initial, action: MappedAction<any, any> = { type: '', payload: undefined }) => {
            let handler = this.cases[action.type];
            return handler ? handler(state, action.payload, action) : state;
        };
    }
}
